import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { BoardService } from '../../../api/services/board.service';
import { WorkItemService } from '../../../api/services/work-item.service';
import { BoardsTreeProvider } from '../../../tree-providers';

suite('BoardTreeProvider', () => {
	test('invalid configuration returns empty list', () => {
        const context = {} as vscode.ExtensionContext;
        const appSettingsService = {
            isValidAppSettings() {
                return false;
            }
        };
        const boardService = {
    
        } as BoardService;
        const workItemService = {
    
        } as WorkItemService;
        const subject = new BoardsTreeProvider(
            context,
            appSettingsService,
            boardService,
            workItemService
        );
        const children = subject.getChildren();
        assert.deepEqual(children, []);
	});
});

