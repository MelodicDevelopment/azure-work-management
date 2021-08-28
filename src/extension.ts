import * as vscode from 'vscode';
import { Iteration, IterationService, TeamFieldValuesService } from './api';
import { BoardTreeProvider } from './apps/boards/board-tree.provider';

const initialize = (globalstate: vscode.Memento): Promise<void[]> => {
	return Promise.all([setCurrentIteration(globalstate), setSystemAreaPaths(globalstate)]);
};

const setCurrentIteration = (globalstate: vscode.Memento): Promise<void> => {
	const iterationService: IterationService = new IterationService();
	return iterationService.getCurrentIteration().then((iterations: Iteration[]) => {
		if (iterations.length > 0) {
			globalstate.update('current-iteration-path', iterations[0].path);
		}
	});
};

const setSystemAreaPaths = (globalstate: vscode.Memento): Promise<void> => {
	const teamFieldValuesService: TeamFieldValuesService = new TeamFieldValuesService();
	return teamFieldValuesService.getTeamFieldValues().then((teamFieldValues) => {
		globalstate.update('system-area-path', JSON.stringify([...teamFieldValues.values.map((tfv) => tfv.value)]));
	});
};

export function activate(context: vscode.ExtensionContext) {
	initialize(context.globalState).then(() => {
		const boardTreeProvider: BoardTreeProvider = new BoardTreeProvider(context.globalState);

		vscode.window.registerTreeDataProvider('azure-work-management:boards', boardTreeProvider);
		vscode.commands.registerCommand('azure-work-management:boards.refreshBoards', () => boardTreeProvider.refresh());
	});
}
