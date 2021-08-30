import * as vscode from 'vscode';
import { BoardsTreeProvider } from './apps/boards/board-tree.provider';
import { BoardsConfigPanel } from './apps/boards/boards-config.panel';

export function activate(context: vscode.ExtensionContext) {
	const boardTreeProvider: BoardsTreeProvider = new BoardsTreeProvider(context);

	vscode.window.registerTreeDataProvider('azure-work-management:boards', boardTreeProvider);
	vscode.commands.registerCommand('azure-work-management:boards.refreshBoards', () => boardTreeProvider.refresh());

	vscode.commands.registerCommand('azure-work-management:openConfigPanel', () => {
		BoardsConfigPanel.createOrShow(context.extensionUri);
	});
}
