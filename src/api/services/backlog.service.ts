import { ApiBase } from '../api-base.class';
import { BackLog } from '../types/backlog.type';
import { MultValueResponse } from '../types/multi-value-response.type';
import { getAppSettings, getTeamContext } from '../../services';
import { BacklogWorkItemResponse, WorkItem } from '..';
import { WorkItemService } from '.';

export class BacklogService extends ApiBase {
	private _workItemService: WorkItemService = new WorkItemService();

	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

	protected apiVersion: string = 'api-version=6.1-preview.1';

	constructor() {
		super('_apis/work/backlogs');
	}

	async getBacklogs() {
		const workApi = await this.webApi.getWorkApi();
		return workApi.getBacklogs(getTeamContext());
	}

	async getBacklogWorkItems(backlogID: string) {
		const workApi = await this.webApi.getWorkApi();
		const workItems = await workApi.getBacklogLevelWorkItems(getTeamContext(), backlogID);
		const ids = (workItems.workItems ?? []).map(workItemID => workItemID.target?.id).filter((id): id is number => typeof id === "number");
		return this._workItemService.getWorkItems(ids);
	}
}
