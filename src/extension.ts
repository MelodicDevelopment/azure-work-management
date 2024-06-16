import * as vscode from 'vscode';
import { chooseAction } from './actions/work-item-edit.actions';
import { BacklogService } from './api/services/backlog.service';
import { BoardService } from './api/services/board.service';
import { IterationService } from './api/services/iteration.service';
import { TeamFieldValuesService } from './api/services/team-field-values.service';
import { TeamService } from './api/services/team.service';
import { WorkItemService } from './api/services/work-item.service';
import { AppSettingsService } from './services/app-settings.service';
import { WorkItemItem } from './tree-items/work-item-item.class';
import { BacklogTreeProvider } from './tree-providers/backlog-tree.provider';
import { BoardsTreeProvider } from './tree-providers/board-tree.provider';

export function activate(context: vscode.ExtensionContext) {
	const appSettingsService = new AppSettingsService();
	const workItemService = new WorkItemService(appSettingsService);
	const backlogService = new BacklogService(
		appSettingsService,
		workItemService,
	);
	const boardService = new BoardService(appSettingsService);
	const iterationService = new IterationService(appSettingsService);
	const teamService = new TeamService(appSettingsService);
	const teamFieldValuesService = new TeamFieldValuesService(appSettingsService);
	const boardTreeProvider: BoardsTreeProvider = new BoardsTreeProvider(
		context,
		appSettingsService,
		boardService,
		workItemService,
	);
	const backlogTreeProvider: BacklogTreeProvider = new BacklogTreeProvider(
		context,
		appSettingsService,
		backlogService,
	);

	vscode.window.registerTreeDataProvider(
		'azure-work-management.open-boards',
		boardTreeProvider,
	);
	vscode.window.registerTreeDataProvider(
		'azure-work-management.open-backlogs',
		backlogTreeProvider,
	);

	vscode.commands.registerCommand('azure-work-management.refresh-boards', () =>
		boardTreeProvider.refresh(),
	);
	vscode.commands.registerCommand(
		'azure-work-management.refresh-backlogs',
		() => backlogTreeProvider.refresh(),
	);

	vscode.commands.registerCommand(
		'azure-work-management.open-config-settings',
		() => {
			vscode.commands.executeCommand(
				'workbench.action.openSettings',
				'azure-work-management',
			);
		},
	);

	vscode.commands.registerCommand(
		'azure-work-management.set-iteration',
		async () => {
			await setSystemAreaPaths(context.globalState, teamFieldValuesService);
			setCurrentIteration(appSettingsService, iterationService);
		},
	);

	vscode.commands.registerCommand(
		'azure-work-management.open-work-item',
		(workItem: WorkItemItem) => {
			const organizationName: string = encodeURI(
				appSettingsService.getOrganization(),
			);
			const projectName: string = encodeURI(appSettingsService.getProject());
			vscode.env.openExternal(
				vscode.Uri.parse(
					`${appSettingsService.getServerUrl()}${organizationName}/${projectName}/_workitems/edit/${workItem.getWorkItemID()}`,
				),
			);
		},
	);

	vscode.commands.registerCommand(
		'azure-work-management.edit-work-item',
		(workItem: WorkItemItem) => {
			chooseAction(workItem, {
				appSettingsService,
				workItemService,
				teamService,
			});
		},
	);
}

const setCurrentIteration = async (
	appSettingsService: AppSettingsService,
	iterationService: IterationService,
) => {
	const iterationsRaw = await iterationService.getIterations();

	const iterationTimeframes = {
		0: 'Past',
		1: 'Current',
		2: 'Future',
		3: 'Unknown',
	};

	const iterations = iterationsRaw.map((iteration) => ({
		label: `${iteration.name}:${iterationTimeframes[iteration.attributes!.timeFrame ?? 3]}`,
		data: iteration,
	}));

	const result = await vscode.window.showQuickPick(iterations, {
		placeHolder: 'Choose An Iteration',
	});

	if (result) {
		appSettingsService
			.getAppSettings()
			.update('iteration', result.data.path, true);
	}

	setTimeout(() => {
		vscode.commands.executeCommand('azure-work-management.refresh-boards');
	}, 1000);
};

const setSystemAreaPaths = async (
	globalState: vscode.Memento,
	teamFieldValuesService: TeamFieldValuesService,
) => {
	globalState.update('system-area-path', null);
	const teamFields = await teamFieldValuesService.getTeamFieldValues();
	globalState.update(
		'system-area-path',
		JSON.stringify([...(teamFields.values ?? [])]),
	);
};
