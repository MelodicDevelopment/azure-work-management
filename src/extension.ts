import * as vscode from 'vscode';
import { BoardsSideBarProvider } from './apps/boards/boards-sidebar.provider';
import { BoardService } from './api/services';

export function activate(context: vscode.ExtensionContext) {
	const boardsSideBarProvider: BoardsSideBarProvider = new BoardsSideBarProvider(context.extensionUri);
	const boardService: BoardService = new BoardService();

	context.subscriptions.push(
		vscode.commands.registerCommand('azure-work-management.helloWorld', () => {
			vscode.window.showInformationMessage('Coming Soon');

			boardService.getAll().then(console.log);
		}),

		vscode.window.registerWebviewViewProvider('azure-work-management:boards', boardsSideBarProvider)
	);
}

export function deactivate() {}
