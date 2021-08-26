import * as vscode from 'vscode';

export class BoardsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | null | undefined> | undefined;

	constructor(private _workspaceRoot: string | undefined) {}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		throw new Error('Method not implemented.');
	}
}
