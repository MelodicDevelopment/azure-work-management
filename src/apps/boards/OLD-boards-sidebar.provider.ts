import * as vscode from 'vscode';

export class BoardsSideBarProvider implements vscode.WebviewViewProvider {
	constructor(private readonly _extensionUri: vscode.Uri) {}

	resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		webviewView.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>Coming Soon</title>
				</head>
				<body>
					<h1>Azure DevOps Boards Coming Soon!</h1>
				</body>
			</html>
		`;
	}
}
