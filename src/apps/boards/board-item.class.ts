import * as vscode from 'vscode';
import { Board } from '../../api/types';

export class BoardItem extends vscode.TreeItem {
	contextValue = 'board';

	constructor(private _board: Board, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_board.name, collapsibleState);
	}

	getBoardID(): string {
		return this._board.id;
	}
}
