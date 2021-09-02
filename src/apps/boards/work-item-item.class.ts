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

		this.tooltip = `Assigned to: ${_workItem.fields['System.AssignedTo'].displayName}\n${removeTags(_workItem.fields['System.Description'])}`;
	}

	getWorkItemID(): number {
		return this._workItem.id;
	}
}

const removeTags = (str: string): string => {
	return str.replace(/(<([^>]+)>)/gi, '');
};
