import * as vscode from 'vscode';
import { BoardsSideBarProvider } from './apps/boards/OLD-boards-sidebar.provider';

export function activate(context: vscode.ExtensionContext) {
	//const boardsSideBarProvider: BoardsSideBarProvider = new BoardsSideBarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.commands.registerCommand('azure-work-management.helloWorld', () => {
			vscode.window.showInformationMessage('Coming Soon');
		})

		//vscode.window.registerWebviewViewProvider('azure-work-management:boards', boardsSideBarProvider)
	);
}

export function deactivate() {}
