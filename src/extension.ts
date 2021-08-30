import * as vscode from 'vscode';
import { BoardsTreeProvider } from './apps/boards/board-tree.provider';
import { BoardsConfigPanel } from './apps/boards/boards-config.panel';

export function activate(context: vscode.ExtensionContext) {
	const boardTreeProvider: BoardsTreeProvider = new BoardsTreeProvider(context);

	vscode.window.registerTreeDataProvider('azure-work-management.open-boards', boardTreeProvider);
	vscode.commands.registerCommand('azure-work-management.refresh-boards', () => boardTreeProvider.refresh());

	vscode.commands.registerCommand('azure-work-management.open-config-panel', () => {
		BoardsConfigPanel.createOrShow(context.extensionUri);
	});

	vscode.commands.registerCommand('azure-work-management.open-config-settings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'azure-work-management');
	});
}
