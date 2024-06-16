import { BoardColumn } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import * as vscode from 'vscode';
import { TeamFieldValue } from '../api';
import { BoardService, WorkItemService } from '../api/services';
import { getAppSettings, isValidAppSettings } from '../services';
import { BoardItem } from '../tree-items/board-item.class';
import { ColumnItem } from '../tree-items/column-item.class';
import { WorkItemItem } from '../tree-items/work-item-item.class';

export class BoardsTreeProvider
	implements vscode.TreeDataProvider<vscode.TreeItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<
		BoardItem | undefined | void
	> = new vscode.EventEmitter<BoardItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BoardItem | undefined | void> =
		this._onDidChangeTreeData.event;

	constructor(
		private _context: vscode.ExtensionContext,
		private _boardService: BoardService,
		private _workItemService: WorkItemService,
	) {}

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
				default: this.getBoards.bind(this),
				board: this.getColumns.bind(this, element as BoardItem),
				column: this.getWorkItems.bind(this, element as ColumnItem),
				workItem: () => Promise.resolve([]),
			};

			const key: string = element?.contextValue || 'default';
			return contextValueGetters[key]();
		}

		return [];
	}

	private async getBoards(): Promise<BoardItem[]> {
		const boards = await this._boardService.getAll();
		return boards.map((board) => {
			return new BoardItem(board, vscode.TreeItemCollapsibleState.Collapsed);
		});
	}

	private async getColumns(element: BoardItem) {
		const columns = await this._boardService.getColumns(element.getBoardID());
		element.setColumns(columns);

		return columns.map((column) => {
			return new ColumnItem(
				element,
				column,
				vscode.TreeItemCollapsibleState.Collapsed,
			);
		});
	}

	private async getWorkItems(element: ColumnItem) {
		const iterationPath: string = getAppSettings().get('iteration') as string;
		const systemAreaPaths: TeamFieldValue[] = JSON.parse(
			this._context.globalState.get('system-area-path') as string,
		);
		const boardColumn: string = element.getColumnName();
		const columns: BoardColumn[] = element.getBoardItem().getColumns();
		const workItemTypes: string[] = element.getAllowedWorkItemTypes();
		const workItems = await this._workItemService.queryForWorkItems(
			iterationPath,
			systemAreaPaths,
			boardColumn,
			workItemTypes,
		);

		return workItems.map((workItem) => {
			return new WorkItemItem(
				workItem,
				columns,
				vscode.TreeItemCollapsibleState.None,
			);
		});
	}
}
