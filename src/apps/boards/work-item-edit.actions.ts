import * as vscode from 'vscode';
import { WorkItemItem } from '.';
import { Column, TeamService, WorkItemService } from '../../api';
import { getAppSettings } from '../../services/app-settings.service';

export const chooseAction = async (workItem: WorkItemItem): Promise<void | string> => {
	if (!workItem) {
		return vscode.window.showErrorMessage('This command must be fired from the work item list.');
	}

	const result = await vscode.window.showQuickPick(['Assign To', 'Move To Board'], {
		placeHolder: 'Choose An Action'
	});

	const actionMap: { [key: string]: () => Promise<void | string> } = {
		'Assign To': () => assignToAction(workItem),
		'Move To Board': () => moveToBoardAction(workItem)
	};

	return actionMap[result as string]();
};

export const assignToAction = async (workItem: WorkItemItem): Promise<void | string> => {
	const teamService: TeamService = new TeamService();
	const projectName: string = getAppSettings().get('project') as string;
	const teamName: string = getAppSettings().get('team') as string;

	const result = await vscode.window.showQuickPick(
		teamService.getTeamMembers(projectName, teamName).then((users) => users.map((user) => user.displayName)),
		{
			placeHolder: 'Choose A Column'
		}
	);

	return vscode.window.showInformationMessage(result as string);
};

// Message: Request failed with status code 500
// Url: https://dev.azure.com/nhaschools/_apis/projects/School Apps/teams/Teacher Support/members?api-version=6.0-preview.3
// Stack: Error: Request failed with status code 500
// 	at createError (/Users/rickhopkins/Source/MelodicDevelopment/azure-work-management/dist/extension.js:1348:15)
// 	at settle (/Users/rickhopkins/Source/MelodicDevelopment/azure-work-management/dist/extension.js:1317:12)
// 	at IncomingMessage.handleStreamEnd (/Users/rickhopkins/Source/MelodicDevelopment/azure-work-management/dist/extension.js:1930:11)
// 	at IncomingMessage.emit (events.js:327:22)
// 	at endReadableNT (internal/streams/readable.js:1327:12)
// 	at processTicksAndRejections (internal/process/task_queues.js:80:21)

export const moveToBoardAction = async (workItem: WorkItemItem): Promise<void | string> => {
	const columns: Column[] = workItem.getColumns();

	const result = await vscode.window.showQuickPick(
		columns.map((c) => c.name),
		{
			placeHolder: 'Choose A Column'
		}
	);

	const workItemService: WorkItemService = new WorkItemService();

	return workItemService
		.updateWorkItem(workItem.getWorkItemID(), [
			{
				op: 'test',
				path: '/rev',
				value: workItem.getWorkItemRev()
			},
			{
				op: 'add',
				path: `/fields/${workItem.getBoardColumnFieldName()}`,
				value: result as string
			}
		])
		.then((_) => {
			vscode.commands.executeCommand('azure-work-management.refresh-boards');
			return vscode.window.showInformationMessage(`Work item moved to ${result}`);
		});
};
