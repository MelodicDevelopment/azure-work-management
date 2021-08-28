import * as path from 'path';
import * as vscode from 'vscode';
import { Board } from '../../api/types';

export class BoardItem extends vscode.TreeItem {
	contextValue = 'board';

	iconPath = path.join(__filename, '..', '..', 'src', 'resources', 'board.svg');

	constructor(private _board: Board, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(_board.name, collapsibleState);
	}

	getBoardID(): string {
		return this._board.id;
	}
}
