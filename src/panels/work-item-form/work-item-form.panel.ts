import * as path from 'path';
import * as vscode from 'vscode';

export class WorkItemFormPanel implements vscode.WebviewViewProvider {
	public static currentPanel: WorkItemFormPanel | undefined;
	public static readonly viewType = 'azure-work-management:work-item-form-panel';

	constructor(private _panel: vscode.WebviewPanel, private readonly _extensionUri: vscode.Uri) {}

	resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
		const resourceRoot: string = this._panel.webview.asWebviewUri(WorkItemFormPanel.createResourceRoot(this._extensionUri)).toString();
		this._panel.webview.html = this.getHtml(resourceRoot);

		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

		if (WorkItemFormPanel.currentPanel) {
			WorkItemFormPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(WorkItemFormPanel.viewType, 'Azure Work Item', column || vscode.ViewColumn.One, {
			enableScripts: true,
			localResourceRoots: [WorkItemFormPanel.createResourceRoot(this._extensionUri)]
		});

		WorkItemFormPanel.currentPanel = new WorkItemFormPanel(panel, this._extensionUri);

		// webviewView.webview.onDidReceiveMessage(data => {
		// 	switch (data.type) {
		// 		case 'colorSelected':
		// 			{
		// 				vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
		// 				break;
		// 			}
		// 	}
		// });

		// this._view.webview.postMessage({ type: 'addColor' });
		// vscode.postMessage({ type: 'colorSelected', value: color });
	}

	public static createResourceRoot(extensionUri: vscode.Uri): vscode.Uri {
		return vscode.Uri.file(path.join(extensionUri.path, 'src', 'panels', 'work-item-form', 'content'));
	}

	public static createOrShow(extensionUri: vscode.Uri) {}

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

// <!DOCTYPE html>
// 	<html lang="en">
// 	<head>
// 		<meta charset="UTF-8">

// 		<!--
// 			Use a content security policy to only allow loading images from https or from our extension directory,
// 			and only allow scripts that have a specific nonce.
// 		-->
// 		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">

// 		<link href="${styleResetUri}" rel="stylesheet">
// 		<link href="${styleVSCodeUri}" rel="stylesheet">
// 		<link href="${styleMainUri}" rel="stylesheet">

// 		<title>Cat Colors</title>
// 	</head>
// 	<body>
// 		<ul class="color-list">
// 		</ul>

// 		<button class="add-color-button">Add Color</button>

// 		<script nonce="${nonce}" src="${scriptUri}"></script>
// 	</body>
// </html>
