import * as vscode from 'vscode';
import { BoardsSideBarProvider } from './apps/boards/boards-sidebar.provider';

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('azure-work-management');

	const boardsSideBarProvider: BoardsSideBarProvider = new BoardsSideBarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.commands.registerCommand('azure-work-management.helloWorld', () => {
			vscode.window.showInformationMessage('Coming Soon');

			console.log(config);
		}),

		vscode.window.registerWebviewViewProvider('azure-work-management:boards', boardsSideBarProvider)
	);
}

export function deactivate() {}

// Azure DevOps Test PAT
// dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta
// rhopkins@nhaschools.com:dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta
// base64 = cmhvcGtpbnNAbmhhc2Nob29scy5jb206ZHY3aHRwbmhydzRla2lnazNrZ3ZpcDQ0YjdkYm1nZmhnaGFjM2pod3U3eWI1eXh1ZnB0YQ==

// async function getBoards() {
// 	const response = await fetch('https://dev.azure.com/nhaschools/School Apps/Teacher Support/_apis/work/boards?api-version=6.0', {
// 		headers: {
// 			'Accept': '*/*',
// 			'User-Agent': 'Thunder Client (https://www.thunderclient.io)',
// 			'Authorization': 'Basic cmhvcGtpbnNAbmhhc2Nob29scy5jb206ZHY3aHRwbmhydzRla2lnazNrZ3ZpcDQ0YjdkYm1nZmhnaGFjM2pod3U3eWI1eXh1ZnB0YQ=='
// 		}
// 	});

// 	const data = await response.json();

// 	console.log(data);
// }
