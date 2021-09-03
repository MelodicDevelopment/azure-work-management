import * as vscode from 'vscode';
import { WorkItemItem } from '.';

export const chooseAction = async (workItem: WorkItemItem): Promise<void | string> => {
	console.log(workItem);

	if (!workItem) {
		return vscode.window.showErrorMessage('This command must be fired from the work item list.');
	}

	const result = await vscode.window.showQuickPick(['Assign To', 'Move To Board'], {
		placeHolder: 'Choose An Action'
	});

	return vscode.window.showInformationMessage(result as string);
};
