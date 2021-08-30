import * as vscode from 'vscode';

export class BoardsConfigPanel {
	public static currentPanel: BoardsConfigPanel | undefined;
	public static readonly viewType = 'azure-work-management:boards-config-panel';

	constructor(private _panel: vscode.WebviewPanel, private readonly _extensionUri: vscode.Uri) {
		_panel.webview.html = this.getHtml();
	}

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		if (BoardsConfigPanel.currentPanel) {
			BoardsConfigPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(BoardsConfigPanel.viewType, 'Azure Work Management Configuration', column || vscode.ViewColumn.One, {
			enableScripts: true,
			localResourceRoots: [extensionUri]
		});

		BoardsConfigPanel.currentPanel = new BoardsConfigPanel(panel, extensionUri);
	}

	private getHtml(): string {
		return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>Coming Soon</title>
				</head>
				<body>
					<h1>Azure Work Management Config!</h1>
				</body>
			</html>
		`;
	}
}
