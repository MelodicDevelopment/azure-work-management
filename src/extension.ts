import * as vscode from 'vscode';
import { BoardTreeProvider } from './apps/boards/board-tree.provider';

export function activate(context: vscode.ExtensionContext) {
	const boardTreeProvider: BoardTreeProvider = new BoardTreeProvider();

	vscode.window.registerTreeDataProvider('azure-work-management:boards', boardTreeProvider);
	vscode.commands.registerCommand('azure-work-management:boards.refreshBoards', () => boardTreeProvider.refresh());
}
