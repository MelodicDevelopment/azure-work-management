import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { WorkItemService } from './work-item.service';

export class BacklogService {
	constructor(
		private _appSettingsService: AppSettingsService,
		private _workItemService: WorkItemService,
	) {}

	async getBacklogs() {
		const workApi = await getWebApi(this._appSettingsService).getWorkApi();
		return workApi.getBacklogs(this._appSettingsService.getTeamContext());
	}

	async getBacklogWorkItems(backlogID: string) {
		const workApi = await getWebApi(this._appSettingsService).getWorkApi();
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
