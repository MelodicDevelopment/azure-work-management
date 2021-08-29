import { AxiosResponse } from 'axios';
import { ApiBase } from '../api-base.class';
import { MultValueResponse, WorkItem } from '../types';
import { WiqlQueryResult } from '../types/wiql-query-result.type';
import { CommonWorkItemProperties, WorkItemBatchRequest } from '../types/work-item-batch-request.type';
import { appSettings } from '../../services';

//https://dev.azure.com/{organization}/{project}/{team}/_apis/wit/wiql?api-version=6.0

export class WorkItemService extends ApiBase {
	protected projectName: string = appSettings.get('project') as string;
	protected teamName: string = appSettings.get('team') as string;

	constructor() {
		super('_apis/wit');
	}

	queryForWorkItems(iterationPath: string, areaPath: string[], boardColumn: string): Promise<WorkItem[]> {
		const systemAreaPath: string = areaPath.map((ap) => `[System.AreaPath] = '${ap}'`).join(' OR ');

		const data: { query: string } = {
			query: `SELECT [System.State], [System.Title] FROM WorkItems WHERE [System.IterationPath] = '${iterationPath}' AND (${systemAreaPath}) AND [System.BoardColumn] = '${boardColumn}' ORDER BY [State] Asc`
		};

		return this.axios
			.post(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}/wiql?${this.apiVersion}`, data)
			.then((response: AxiosResponse<WiqlQueryResult>) => {
				return this.getWorkItemsByBatch(response.data.workItems.map((wi) => wi.id));
			});
	}

	getWorkItems(ids: number[]): Promise<WorkItem[]> {
		return this.axios
			.get(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.endPoint}/workitems?${this.apiVersion}&ids=${ids.join(',')}&$expand=All`)
			.then((response) => {
				return (response.data as MultValueResponse<WorkItem>).value;
			});
	}

	getWorkItemsByBatch(ids: number[]): Promise<WorkItem[]> {
		const data: WorkItemBatchRequest = {
			ids: ids,
			fields: CommonWorkItemProperties
		};

		return this.axios.post(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.endPoint}/workitemsbatch?${this.apiVersion}`, data).then((response) => {
			return (response.data as MultValueResponse<WorkItem>).value;
		});
	}
}
