import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { BoardService } from '../../../api/services/board.service';
import { WorkItemService } from '../../../api/services/work-item.service';
import { BoardsTreeProvider } from '../../../tree-providers/board-tree.provider';
import { mockAppSettingService } from '../../helpers/mockAppSettingService';
import { BoardItem } from '../../../tree-items/board-item.class';

suite('BoardTreeProvider', () => {
	test('invalid configuration returns empty list', () => {
		const context = {} as vscode.ExtensionContext;
		const appSettingsService = mockAppSettingService;
		const boardService = {} as BoardService;
		const workItemService = {} as WorkItemService;
		const subject = new BoardsTreeProvider(
			context,
			appSettingsService(false),
			boardService,
			workItemService,
		);
		const children = subject.getChildren();
		assert.deepEqual(children, []);
	});

	test('return boards', async () => {
		const context = {} as vscode.ExtensionContext;
		const appSettingsService = mockAppSettingService;
		const boardService = {
			getAll: async () => {
				return [{
					name: 'test-board1',
					id: 'test-id1',
					url: 'test-board-url1'
				}];
			} 
		} as BoardService;
		const workItemService = {} as WorkItemService;
		const subject = new BoardsTreeProvider(
			context,
			appSettingsService(true),
			boardService,
			workItemService,
		);
		const children = await (subject.getChildren() as Promise<BoardItem[]>);
		assert.equal(children.length, 1);
		assert.deepEqual(children[0].label, 'test-board1');
	});
});
