import * as path from 'path';
import * as vscode from 'vscode';
import { WorkItem } from '../../api/types';

export class WorkItemItem extends vscode.TreeItem {
	contextValue = 'workItem';

	iconPath = path.join(
		__filename,
		'..',
		'..',
		'src',
		'resources',
		this._workItem.fields['System.WorkItemType'] === 'User Story' ? 'user-story-work-item.svg' : 'bug-work-item.svg'
	);

	constructor(private _workItem: WorkItem, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_workItem.fields['System.Title'], collapsibleState);
	}

	getWorkItemID(): string {
		return this._workItem.id;
	}
}
