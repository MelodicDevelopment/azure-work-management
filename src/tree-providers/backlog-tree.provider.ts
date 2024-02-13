import * as vscode from 'vscode';
import { BacklogService } from '../api';
import { isValidAppSettings } from '../services';
import { BacklogItem } from '../tree-items/backlog-item.class';
import { WorkItemItem } from '../tree-items/work-item-item.class';

export class BacklogTreeProvider
	implements vscode.TreeDataProvider<vscode.TreeItem>
{
	private _backlogService: BacklogService = new BacklogService();

	private _onDidChangeTreeData: vscode.EventEmitter<
		BacklogItem | undefined | void
	> = new vscode.EventEmitter<BacklogItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BacklogItem | undefined | void> =
		this._onDidChangeTreeData.event;

	constructor(private _context: vscode.ExtensionContext) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(
		element: vscode.TreeItem,
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(
		element?: vscode.TreeItem,
	): vscode.ProviderResult<vscode.TreeItem[]> {
		if (isValidAppSettings()) {
			const contextValueGetters: {
				[key: string]: () => Promise<vscode.TreeItem[]>;
			} = {
				default: this.getBacklogs.bind(this),
				backlog: this.getWorkItems.bind(this, element as BacklogItem),
				workItem: () => Promise.resolve([]),
			};

			const key: string = element?.contextValue || 'default';
			return contextValueGetters[key]();
		}

		return [];
	}

	private async getBacklogs() {
		const backlogs = await this._backlogService.getBacklogs();
		return backlogs.map((backlog) => {
			return new BacklogItem(
				backlog,
				vscode.TreeItemCollapsibleState.Collapsed,
			);
		});
	}

	private async getWorkItems(element: BacklogItem) {
		const backlogID: string = element.getBacklogID();
		const workItems = await this._backlogService.getBacklogWorkItems(backlogID);
		// const types: string[] = workItems.map((wi) => wi.fields['System.WorkItemType']);
		// console.log(types.filter((t, i, a) => a.indexOf(t) === i));

		return workItems.map((workItem) => {
			return new WorkItemItem(
				workItem,
				[],
				vscode.TreeItemCollapsibleState.None,
			);
		});
	}
}
