import * as vscode from 'vscode';
import { Board, Column, Iteration, WorkItem } from '../../api';
import { BoardService, IterationService, TeamFieldValuesService, WorkItemService } from '../../api/services';
import { BoardItem } from './board-item.class';
import { ColumnItem } from './column-item.class';
import { WorkItemItem } from './work-item-item.class';
import { getAppSettings } from '../../services';

const getOrganizationName = (): string => {
	return getAppSettings().get('organization') as string;
};

const getPersonalAccessToken = (): string => {
	return getAppSettings().get('personal-access-token') as string;
};

const setCurrentIteration = (globalstate: vscode.Memento): Promise<void> => {
	const iterationService: IterationService = new IterationService();
	return iterationService.getCurrentIteration().then((iterations: Iteration[]) => {
		if (iterations.length > 0) {
			globalstate.update('current-iteration-path', iterations[0].path);
		}
	});
};

const setSystemAreaPaths = (globalstate: vscode.Memento): Promise<void> => {
	const teamFieldValuesService: TeamFieldValuesService = new TeamFieldValuesService();
	return teamFieldValuesService.getTeamFieldValues().then((teamFieldValues) => {
		globalstate.update('system-area-path', JSON.stringify([...teamFieldValues.values.map((tfv) => tfv.value)]));
	});
};

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
		return this.initialize().then(() => {
			return new Promise(() => {
				if (!getOrganizationName() || !getPersonalAccessToken()) {
					return [];
				}

				const contextValueGetters: { [key: string]: () => Promise<vscode.TreeItem[]> } = {
					default: this.getBoards.bind(this),
					board: this.getColumns.bind(this, element as BoardItem),
					column: this.getWorkItems.bind(this, element as ColumnItem),
					workItem: () => Promise.resolve([])
				};

				const key: string = element?.contextValue || 'default';
				return contextValueGetters[key]();
			});
		});
	}

	private getBoards(): Promise<BoardItem[]> {
		return this._boardService.getAll().then((boards: Board[]) => {
			return boards.map((board) => {
				return new BoardItem(board, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private initialize(): Promise<void> {
		return new Promise((resolve, _) => {
			if (!getOrganizationName() || !getPersonalAccessToken()) {
				vscode.commands.executeCommand('azure-work-management:openConfigPanel');
				resolve();

				// vscode.window.showErrorMessage('Missing Extension Settings', 'Open Settings').then((response) => {
				// 	if (response === 'Open Settings') {
				// 		vscode.commands.executeCommand('workbench.action.openSettings', 'azure-work-management');
				// 	}
				// });

				// let check = setInterval(() => {
				// 	if (getOrganizationName() && getPersonalAccessToken()) {
				// 		clearInterval(check);
				// 		vscode.window.showInformationMessage('Window will reload now to activate the extension.').then(() => {
				// 			return this.loadAdditionalSettings().then(() => {
				// 				this.refresh();
				// 				resolve();
				// 			});
				// 		});
				// 	}
				// }, 100);
			} else {
				return this.loadAdditionalSettings().then(() => {
					resolve();
				});
			}
		});
	}

	private loadAdditionalSettings(): Promise<void[]> {
		return Promise.all([setCurrentIteration(this._context.globalState), setSystemAreaPaths(this._context.globalState)]);
	}

	private getColumns(element: BoardItem): Promise<ColumnItem[]> {
		return this._boardService.getColumns(element.getBoardID()).then((columns: Column[]) => {
			return columns.map((column) => {
				return new ColumnItem(column, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}

	private getWorkItems(element: ColumnItem): Promise<vscode.TreeItem[]> {
		const currentIterationPath: string = this._context.globalState.get('current-iteration-path') as string;
		const systemAreaPaths: string[] = JSON.parse(this._context.globalState.get('system-area-path') as string) as string[];
		const boardColumn: string = element.getColumnName();

		return this._workItemService.queryForWorkItems(currentIterationPath, systemAreaPaths, boardColumn).then((workItems: WorkItem[]) => {
			return workItems.map((workItem) => {
				return new WorkItemItem(workItem, vscode.TreeItemCollapsibleState.Collapsed);
			});
		});
	}
}
