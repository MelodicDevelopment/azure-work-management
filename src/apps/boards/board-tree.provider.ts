import * as vscode from 'vscode';
import { Board, Column } from '../../api';
import { BoardService } from '../../api/services';
import { BoardItem } from './board-item.class';
import { ColumnItem } from './column-item.class';

export class BoardTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _boardService: BoardService = new BoardService();

	private _onDidChangeTreeData: vscode.EventEmitter<BoardItem | undefined | void> = new vscode.EventEmitter<BoardItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<BoardItem | undefined | void> = this._onDidChangeTreeData.event;

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
		return Promise.resolve([]);
	}
}
