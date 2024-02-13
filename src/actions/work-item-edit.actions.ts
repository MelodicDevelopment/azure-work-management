import { BoardColumn } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import * as vscode from 'vscode';
import { TeamService, WorkItemService } from '../api';
import { getAppSettings } from '../services/app-settings.service';
import { WorkItemItem } from '../tree-items';

export const chooseAction = async (
	workItem: WorkItemItem,
): Promise<void | string> => {
	if (!workItem) {
		return vscode.window.showErrorMessage(
			'This command must be fired from the work item list.',
		);
	}

	const result = await vscode.window.showQuickPick(
		['Assign To', 'Move To Board'],
		{
			placeHolder: 'Choose An Action',
		},
	);

	if (result) {
		const actionMap: { [key: string]: () => Promise<void | string> } = {
			'Assign To': () => assignToAction(workItem),
			'Move To Board': () => moveToBoardAction(workItem),
		};

		return actionMap[result as string]();
	}
};

export const assignToAction = async (
	workItem: WorkItemItem,
): Promise<void | string> => {
	const teamService: TeamService = new TeamService();
	const workItemService: WorkItemService = new WorkItemService();
	const projectName: string = getAppSettings().get('project') as string;
	const teamName: string = getAppSettings().get('team') as string;

	const result = await vscode.window.showQuickPick(
		teamService
			.getTeamMembers(projectName, teamName)
			.then((users) => users.map((user) => user.identity!.displayName!)),
		{
			placeHolder: 'Choose A Column',
		},
	);

	if (result) {
		await workItemService.updateWorkItem(workItem.getWorkItemID(), [
			{
				op: 'test',
				path: '/rev',
				value: workItem.getWorkItemRev(),
			},
			{
				op: 'add',
				path: `/fields/System.AssignedTo`,
				value: result as string,
			},
		]);

		vscode.commands.executeCommand('azure-work-management.refresh-boards');
		return vscode.window.showInformationMessage(
			`Work item assigned to ${result}`,
		);
	}
};

export const moveToBoardAction = async (
	workItem: WorkItemItem,
): Promise<void | string> => {
	const columns: BoardColumn[] = workItem.getColumns();

	const result = await vscode.window.showQuickPick(
		columns.map((c) => c.name!),
		{
			placeHolder: 'Choose A Column',
		},
	);

	if (result) {
		const workItemService: WorkItemService = new WorkItemService();
		await workItemService.updateWorkItem(workItem.getWorkItemID(), [
			{
				op: 'test',
				path: '/rev',
				value: workItem.getWorkItemRev(),
			},
			{
				op: 'add',
				path: `/fields/${workItem.getBoardColumnFieldName()}`,
				value: result as string,
			},
		]);
		vscode.commands.executeCommand('azure-work-management.refresh-boards');
		return vscode.window.showInformationMessage(`Work item moved to ${result}`);
	}
};
