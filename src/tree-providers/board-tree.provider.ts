import * as vscode from 'vscode';
import { Board, Column, WorkItem } from '../api';
import { BoardService, WorkItemService } from '../api/services';
import { BoardItem } from '../tree-items/board-item.class';
import { ColumnItem } from '../tree-items/column-item.class';
import { WorkItemItem } from '../tree-items/work-item-item.class';
import { getAppSettings, isValidAppSettings } from '../services';

export class BoardsTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _boardService: BoardService = new BoardService();
	private _workItemService: WorkItemService = new WorkItemService();

	private _onDidChangeTreeData: vscode.EventEmitter<BoardItem | undefined | void> = new vscode.EventEmitter<BoardItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BoardItem | undefined | void> = this._onDidChangeTreeData.event;

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
				default: this.getBoards.bind(this),
				board: this.getColumns.bind(this, element as BoardItem),
				column: this.getWorkItems.bind(this, element as ColumnItem),
				workItem: () => Promise.resolve([])
			};

			const key: string = element?.contextValue || 'default';
			return contextValueGetters[key]();
		}

		return [];
	}

	private getBoards(): Promise<BoardItem[]> {
		return this._boardService.getAll().then((boards: Board[]) => {
			return boards.map((board) => {
				return new BoardItem(board, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private getColumns(element: BoardItem): Promise<ColumnItem[]> {
		return this._boardService.getColumns(element.getBoardID()).then((columns: Column[]) => {
			element.setColumns(columns);

			return columns.map((column) => {
				return new ColumnItem(element, column, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private getWorkItems(element: ColumnItem): Promise<vscode.TreeItem[]> {
		const iterationPath: string = getAppSettings().get('iteration') as string;
		const systemAreaPaths: string[] = JSON.parse(this._context.globalState.get('system-area-path') as string) as string[];
		const boardColumn: string = element.getColumnName();
		const columns: Column[] = element.getBoardItem().getColumns();
		const workItemTypes: string[] = element.getAllowedWorkItemTypes();

		return this._workItemService.queryForWorkItems(iterationPath, systemAreaPaths, boardColumn, workItemTypes).then((workItems: WorkItem[]) => {
			return workItems.map((workItem) => {
				return new WorkItemItem(workItem, columns, vscode.TreeItemCollapsibleState.None);
			});
		});
	}
}
