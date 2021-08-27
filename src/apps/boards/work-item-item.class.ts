import * as vscode from 'vscode';
import { WorkItem } from '../../api/types';

export class WorkItemItem extends vscode.TreeItem {
	contextValue = 'workItem';

	constructor(private _workItem: WorkItem, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_workItem.fields['System.Title'], collapsibleState);
	}

	getWorkItemID(): string {
		return this._workItem.id;
	}
}
