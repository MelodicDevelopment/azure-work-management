import * as vscode from 'vscode';
import { BackLog, BacklogService, WorkItem } from '../api';
import { BacklogItem } from '../tree-items/backlog-item.class';
import { WorkItemItem } from '../tree-items/work-item-item.class';
import { isValidAppSettings } from '../services';

export class BacklogTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _backlogService: BacklogService = new BacklogService();

	private _onDidChangeTreeData: vscode.EventEmitter<BacklogItem | undefined | void> = new vscode.EventEmitter<BacklogItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BacklogItem | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private _context: vscode.ExtensionContext) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		if (isValidAppSettings()) {
			const contextValueGetters: { [key: string]: () => Promise<vscode.TreeItem[]> } = {
				default: this.getBacklogs.bind(this),
				backlog: this.getWorkItems.bind(this, element as BacklogItem),
				workItem: () => Promise.resolve([])
			};

			const key: string = element?.contextValue || 'default';
			return contextValueGetters[key]();
		}

		return [];
	}

	private getBacklogs(): Promise<BacklogItem[]> {
		return this._backlogService.getBacklogs().then((backlogs: BackLog[]) => {
			return backlogs.map((backlog) => {
				return new BacklogItem(backlog, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private getWorkItems(element: BacklogItem): Promise<vscode.TreeItem[]> {
		const backlogID: string = element.getBacklogID();
		return this._backlogService.getBacklogWorkItems(backlogID).then((workItems: WorkItem[]) => {
			// const types: string[] = workItems.map((wi) => wi.fields['System.WorkItemType']);
			// console.log(types.filter((t, i, a) => a.indexOf(t) === i));

			return workItems.map((workItem) => {
				return new WorkItemItem(workItem, [], vscode.TreeItemCollapsibleState.None);
			});
		});
	}
}
