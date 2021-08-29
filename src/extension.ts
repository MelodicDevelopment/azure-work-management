import * as vscode from 'vscode';
import { Iteration, IterationService, TeamFieldValuesService } from './api';
import { BoardTreeProvider } from './apps/boards/board-tree.provider';
import { getAppSettings } from './services';

const getOrganizationName = (): string => {
	return getAppSettings().get('organization') as string;
};

const getPersonalAccessToken = (): string => {
	return getAppSettings().get('personal-access-token') as string;
};

//const initialize = (globalstate: vscode.Memento): Promise<void> => {
const initialize = (context: vscode.ExtensionContext): Promise<void> => {
	if (!getOrganizationName() || !getPersonalAccessToken()) {
		vscode.window.showErrorMessage('Missing Extension Settings', 'Open Settings').then((response) => {
			if (response === 'Open Settings') {
				vscode.commands.executeCommand('workbench.action.openSettings', 'azure-work-management');
			}
		});

		let check = setInterval(() => {
			if (getOrganizationName() && getPersonalAccessToken()) {
				clearInterval(check);
				vscode.window.showInformationMessage('Window will reload now to activate the extension.').then(() => {
					vscode.commands.executeCommand('workbench.action.reloadWindow');
				});
			}
		}, 100);
	}

	//dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta

	return Promise.resolve();

	//return Promise.all([setCurrentIteration(globalstate), setSystemAreaPaths(globalstate)]);
};

// const setCurrentIteration = (globalstate: vscode.Memento): Promise<void> => {
// 	const iterationService: IterationService = new IterationService();
// 	return iterationService.getCurrentIteration().then((iterations: Iteration[]) => {
// 		if (iterations.length > 0) {
// 			globalstate.update('current-iteration-path', iterations[0].path);
// 		}
// 	});
// };

// const setSystemAreaPaths = (globalstate: vscode.Memento): Promise<void> => {
// 	const teamFieldValuesService: TeamFieldValuesService = new TeamFieldValuesService();
// 	return teamFieldValuesService.getTeamFieldValues().then((teamFieldValues) => {
// 		globalstate.update('system-area-path', JSON.stringify([...teamFieldValues.values.map((tfv) => tfv.value)]));
// 	});
// };

export function activate(context: vscode.ExtensionContext) {
	initialize(context);

	// initialize(context.globalState).then(() => {
	// 	const boardTreeProvider: BoardTreeProvider = new BoardTreeProvider(context.globalState);

	// 	vscode.window.registerTreeDataProvider('azure-work-management:boards', boardTreeProvider);
	// 	vscode.commands.registerCommand('azure-work-management:boards.refreshBoards', () => boardTreeProvider.refresh());
	// });
}
