import { ApiBase } from '../api-base.class';
import { BackLog } from '../types/backlog.type';
import { MultValueResponse } from '../types/multi-value-response.type';
import { getAppSettings } from '../../services';
import { BacklogWorkItemResponse, WorkItem } from '..';
import { WorkItemService } from '.';

export class BacklogService extends ApiBase {
	private _workItemService: WorkItemService = new WorkItemService();

	protected get projectName(): string {
		return getAppSettings().get('project') as string;
	}
	protected get teamName(): string {
		return getAppSettings().get('team') as string;
	}

	protected apiVersion: string = 'api-version=6.1-preview.1';

	constructor() {
		super('_apis/work/backlogs');
	}

	getBacklogs(): Promise<BackLog[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<BackLog>).value;
		});
	}

	getBacklogWorkItems(backlogID: string): Promise<WorkItem[]> {
		return this.axios
			.get(`${this.baseUrl}${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}/${backlogID}/workitems?${this.apiVersion}`)
			.then((response) => {
				const workItemIDs: number[] = (response.data as BacklogWorkItemResponse).workItems.map((wi) => wi.target.id);
				return this._workItemService.getWorkItems(workItemIDs);
			});
	}
}
