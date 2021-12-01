import * as vscode from 'vscode';
import { IterationService, TeamFieldValuesService } from './api/services';
import { Iteration } from './api/types';
import { WorkItemItem } from './tree-items';
import { BoardsTreeProvider } from './tree-providers/board-tree.provider';
import { chooseAction } from './actions/work-item-edit.actions';
import { getAppSettings } from './services';
import { BacklogTreeProvider } from './tree-providers/backlog-tree.provider';
import { WorkItemFormPanel } from './panels/work-item-form';

export function activate(context: vscode.ExtensionContext) {
	const boardTreeProvider: BoardsTreeProvider = new BoardsTreeProvider(context);
	const backlogTreeProvider: BacklogTreeProvider = new BacklogTreeProvider(context);

	// const workItemFormPanel = new WorkItemFormPanel(context.extensionUri);

	// context.subscriptions.push(
	// 	vscode.window.registerWebviewViewProvider(WorkItemFormPanel.viewType, WorkItemFormPanel));

	vscode.window.registerTreeDataProvider('azure-work-management.open-boards', boardTreeProvider);
	vscode.window.registerTreeDataProvider('azure-work-management.open-backlogs', backlogTreeProvider);

	vscode.commands.registerCommand('azure-work-management.refresh-boards', () => boardTreeProvider.refresh());
	vscode.commands.registerCommand('azure-work-management.refresh-backlogs', () => backlogTreeProvider.refresh());

	vscode.commands.registerCommand('azure-work-management.open-config-settings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'azure-work-management');
	});

	vscode.commands.registerCommand('azure-work-management.set-iteration', () => {
		setSystemAreaPaths(context.globalState).then(() => {
			setCurrentIteration();
		});
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

const setCurrentIteration = async (): Promise<void> => {
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
		getAppSettings().update('iteration', result.data.path, true);
	}

	setTimeout(() => {
		vscode.commands.executeCommand('azure-work-management.refresh-boards');
	}, 1000);
};

const setSystemAreaPaths = (globalstate: vscode.Memento): Promise<void> => {
	globalstate.update('system-area-path', null);
	const teamFieldValuesService: TeamFieldValuesService = new TeamFieldValuesService();
	return teamFieldValuesService.getTeamFieldValues().then((teamFieldValues) => {
		globalstate.update('system-area-path', JSON.stringify([...teamFieldValues.values.map((tfv) => tfv.value)]));
	});
};
