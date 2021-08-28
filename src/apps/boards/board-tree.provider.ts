import * as vscode from 'vscode';
import { Board, Column, WorkItem } from '../../api';
import { BoardService, WorkItemService } from '../../api/services';
import { BoardItem } from './board-item.class';
import { ColumnItem } from './column-item.class';
import { WorkItemItem } from './work-item-item.class';

export class BoardTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _boardService: BoardService = new BoardService();
	private _workItemService: WorkItemService = new WorkItemService();

	private _onDidChangeTreeData: vscode.EventEmitter<BoardItem | undefined | void> = new vscode.EventEmitter<BoardItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BoardItem | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private _globalstate: vscode.Memento) {}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		const contextValueGetters: { [key: string]: () => Promise<vscode.TreeItem[]> } = {
			default: this.getBoards.bind(this),
			board: this.getColumns.bind(this, element as BoardItem),
			column: this.getWorkItems.bind(this, element as ColumnItem),
			workItem: () => Promise.resolve([])
		};

		const key: string = element?.contextValue || 'default';
		return contextValueGetters[key]();
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
			return columns.map((column) => {
				return new ColumnItem(column, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private getWorkItems(element: ColumnItem): Promise<vscode.TreeItem[]> {
		const currentIterationPath: string = this._globalstate.get('current-iteration-path') as string;
		const systemAreaPath: string = (JSON.parse(this._globalstate.get('system-area-path') as string) as string[])[0];
		const boardColumn: string = element.getColumnName();

		return this._workItemService.queryForWorkItems(currentIterationPath, systemAreaPath, boardColumn).then((workItems: WorkItem[]) => {
			return workItems.map((workItem) => {
				return new WorkItemItem(workItem, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}
}
