import * as vscode from 'vscode';
import { IterationService, TeamFieldValuesService } from './api/services';
import { Iteration } from './api/types';
import { WorkItemItem } from './apps/boards';
import { BoardsTreeProvider } from './apps/boards/board-tree.provider';
import { chooseAction } from './apps/boards/work-item-edit.actions';
import { getAppSettings } from './services';

export function activate(context: vscode.ExtensionContext) {
	const boardTreeProvider: BoardsTreeProvider = new BoardsTreeProvider(context);

	vscode.window.registerTreeDataProvider('azure-work-management.open-boards', boardTreeProvider);
	vscode.commands.registerCommand('azure-work-management.refresh-boards', () => boardTreeProvider.refresh());

	vscode.commands.registerCommand('azure-work-management.open-config-settings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'azure-work-management');
	});

	vscode.commands.registerCommand('azure-work-management.set-iteration', () => {
		setCurrentIteration(context.globalState);
		setSystemAreaPaths(context.globalState);

		vscode.commands.executeCommand('azure-work-management.refresh-boards');
	});

	vscode.commands.registerCommand('azure-work-management.open-work-item', (workItem: WorkItemItem) => {
		const organizationName: string = getAppSettings().get('organization') as string;
		const projectName: string = getAppSettings().get('project') as string;
		vscode.env.openExternal(vscode.Uri.parse(`https://dev.azure.com/${organizationName}/${projectName}/_workitems/edit/${workItem.getWorkItemID()}`));
	});

	vscode.commands.registerCommand('azure-work-management.edit-work-item', (workItem: WorkItemItem) => {
		chooseAction(workItem);
	});
}

interface IQuickPickItem<T> extends vscode.QuickPickItem {
	data: T;
}

const setCurrentIteration = async (globalstate: vscode.Memento): Promise<void> => {
	const iterationService: IterationService = new IterationService();
	const iterations = iterationService.getIterations().then((iterations) =>
		iterations.map((iteration) => {
			return {
				label: `${iteration.name}:${iteration.attributes.timeFrame}`,
				data: iteration
			} as IQuickPickItem<Iteration>;
		})
	);

	const result = await vscode.window.showQuickPick(iterations, {
		placeHolder: 'Choose An Iteration'
	});

	if (result) {
		getAppSettings().update('iteration', result.data.path);
	}
};

const setSystemAreaPaths = (globalstate: vscode.Memento): Promise<void> => {
	const teamFieldValuesService: TeamFieldValuesService = new TeamFieldValuesService();
	return teamFieldValuesService.getTeamFieldValues().then((teamFieldValues) => {
		globalstate.update('system-area-path', JSON.stringify([...teamFieldValues.values.map((tfv) => tfv.value)]));
	});
};
