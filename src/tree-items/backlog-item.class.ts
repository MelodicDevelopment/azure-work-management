import * as path from 'path';
import * as vscode from 'vscode';
import { BackLog } from '../api/types';

export class BacklogItem extends vscode.TreeItem {
	contextValue = 'backlog';

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'backlog.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'backlog.svg')
	};

	constructor(private _backlog: BackLog, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_backlog.name, collapsibleState);
	}

	getBacklogID(): string {
		return this._backlog.id;
	}

	getBacklog(): BackLog {
		return this._backlog;
	}
}
