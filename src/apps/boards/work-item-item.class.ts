import * as path from 'path';
import * as vscode from 'vscode';
import { Column, WorkItem } from '../../api/types';

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

	constructor(private _workItem: WorkItem, private _columns: Column[], public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_workItem.fields['System.Title'], collapsibleState);

		this.tooltip = `Assigned to: ${_workItem.fields['System.AssignedTo']?.displayName || 'Unassigned'}\n${this.removeTags(_workItem.fields['System.Description'])}`;
	}

	getWorkItemID(): number {
		return this._workItem.id;
	}

	getWorkItemRev(): number {
		return this._workItem.rev;
	}

	getColumns(): Column[] {
		return this._columns;
	}

	getBoardColumnFieldName(): string {
		const fields: string[] = Object.keys(this._workItem.fields);
		for (let field of fields) {
			if (field.endsWith('_Kanban.Column')) {
				return field;
			}
		}

		return '';
	}

	private removeTags(str: string): string {
		if (!str) {
			return '';
		}

		return str.replace(/(<([^>]+)>)/gi, '');
	}
}
