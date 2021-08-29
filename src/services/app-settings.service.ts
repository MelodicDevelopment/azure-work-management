import * as vscode from 'vscode';

export const getAppSettings = (): vscode.WorkspaceConfiguration => vscode.workspace.getConfiguration('azure-work-management');
