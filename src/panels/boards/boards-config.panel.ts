import * as path from 'path';
import * as vscode from 'vscode';

export class BoardsConfigPanel {
	public static currentPanel: BoardsConfigPanel | undefined;
	public static readonly viewType = 'azure-work-management:boards-config-panel';

	constructor(private _panel: vscode.WebviewPanel, private readonly _extensionUri: vscode.Uri) {
		const resourceRoot: string = _panel.webview.asWebviewUri(BoardsConfigPanel.createResourceRoot(_extensionUri)).toString();
		_panel.webview.html = this.getHtml(resourceRoot);
	}

	public static createResourceRoot(extensionUri: vscode.Uri): vscode.Uri {
		return vscode.Uri.file(path.join(extensionUri.path, 'src', 'apps', 'boards', 'boards-config-web'));
	}

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		if (BoardsConfigPanel.currentPanel) {
			BoardsConfigPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(BoardsConfigPanel.viewType, 'Azure Work Management Configuration', column || vscode.ViewColumn.One, {
			enableScripts: true,
			localResourceRoots: [BoardsConfigPanel.createResourceRoot(extensionUri)]
		});

		BoardsConfigPanel.currentPanel = new BoardsConfigPanel(panel, extensionUri);
	}

	private getHtml(resourceRoot: string): string {
		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</head>
				<body>
					<form>
						
					</form>
					<script type="text/javascript" src="${resourceRoot}/main.js"></script>
				</body>
			</html>
		`;
	}
}
