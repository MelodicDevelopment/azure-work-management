import * as path from 'path';
import * as vscode from 'vscode';
import { Column, WorkItem } from '../api/types';

export class WorkItemItem extends vscode.TreeItem {
	contextValue = 'workItem';

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', this.getIcon()),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', this.getIcon())
	};

	command = {
		title: 'Open Work Item',
		command: 'azure-work-management.open-work-item',
		arguments: [this]
	};

	constructor(private _workItem: WorkItem, private _columns: Column[], public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_workItem.fields['System.Title'], collapsibleState);

		this.tooltip = `Assigned to: ${_workItem.fields['System.AssignedTo']?.displayName || 'Unassigned'}\n${
			_workItem.fields['System.Description'] ? '\n' + this.removeTags(_workItem.fields['System.Description']) : ''
		}`;
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

	private getIcon(): string {
		const icons: { [key: string]: string } = {
			'default': 'user-story-work-item.svg',
			'User Story': 'user-story-work-item.svg',
			'Bug': 'bug-work-item.svg',
			'Task': 'task-work-item.svg',
			'Epic': 'epic-work-item.svg',
			'Feature': 'feature-work-item.svg',
			'Project': 'project-work-item.svg'
		};

		const workItemType: string = this._workItem.fields['System.WorkItemType'];
		return icons[workItemType] || icons['default'];
	}

	private removeTags(str: string): string {
		if (!str) {
			return '';
		}

		return str.replace(/(<([^>]+)>)/gi, '');
	}
}
