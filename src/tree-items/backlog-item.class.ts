import { BacklogLevelConfiguration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import * as path from 'path';
import * as vscode from 'vscode';

export class BacklogItem extends vscode.TreeItem {
  contextValue = 'backlog';

  iconPath = {
    light: path.join(
      __filename,
      '..',
      '..',
      'resources',
      'light',
      'backlog.svg',
    ),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'backlog.svg'),
  };

  constructor(
    private _backlog: BacklogLevelConfiguration,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(_backlog.name!, collapsibleState);
  }

  getBacklogID(): string {
    return this._backlog.id!;
  }

  getBacklog(): BacklogLevelConfiguration {
    return this._backlog;
  }
}
