import * as path from 'path';
import * as vscode from 'vscode';
import { Board, Column } from '../api/types';

export class BoardItem extends vscode.TreeItem {
	private _columns: Column[] = [];

	contextValue = 'board';

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'board.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'board.svg')
	};

	constructor(private _board: Board, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_board.name, collapsibleState);
	}

	getBoardID(): string {
		return this._board.id;
	}

	setColumns(columns: Column[]): void {
		this._columns = columns;
	}

	getColumns(): Column[] {
		return this._columns;
	}

	getBoard(): Board {
		return this._board;
	}
}
