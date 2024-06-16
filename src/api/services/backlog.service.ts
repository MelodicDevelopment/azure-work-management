import { getWebApi } from '../../services/api.service';
import {
	AppSettingsService,
	getAppSettings,
} from '../../services/app-settings.service';
import { WorkItemService } from './work-item.service';

export class BacklogService {
	constructor(private _appSettingsService: AppSettingsService, private _workItemService: WorkItemService) {}

	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

	protected apiVersion: string = 'api-version=6.1-preview.1';

	async getBacklogs() {
		const workApi = await getWebApi().getWorkApi();
		return workApi.getBacklogs(this._appSettingsService.getTeamContext());
	}

	async getBacklogWorkItems(backlogID: string) {
		const workApi = await getWebApi().getWorkApi();
		const workItems = await workApi.getBacklogLevelWorkItems(
			this._appSettingsService.getTeamContext(),
			backlogID,
		);
		const ids = (workItems.workItems ?? [])
			.map((workItemID) => workItemID.target?.id)
			.filter((id): id is number => typeof id === 'number');
		return this._workItemService.getWorkItems(ids);
	}
}
