import { AxiosResponse } from 'axios';
import { ApiBase } from '../api-base.class';
import { MultValueResponse, WorkItem } from '../types';
import { WiqlQueryResult } from '../types/wiql-query-result.type';
import { CommonWorkItemProperties, WorkItemBatchRequest } from '../types/work-item-batch-request.type';

//https://dev.azure.com/{organization}/{project}/{team}/_apis/wit/wiql?api-version=6.0

export class WorkItemService extends ApiBase<WorkItem> {
	constructor() {
		super('_apis/wit');
	}

	queryForWorkItems(iterationPath: string, areaPath: string[], boardColumn: string): Promise<WorkItem[]> {
		const systemAreaPath: string = areaPath.map((ap) => `[System.AreaPath] = '${ap}'`).join(' OR ');

		const data: { query: string } = {
			query: `SELECT [System.State], [System.Title] FROM WorkItems WHERE [System.IterationPath] = '${iterationPath}' AND (${systemAreaPath}) AND [System.BoardColumn] = '${boardColumn}' ORDER BY [State] Asc`
		};

		return this.axios
			.post(`${this.getBaseUrl()}/${this.getOrganizationName()}/${this.getProjectName()}/${this.getTeamName()}/${this.endPoint}/wiql${this.getApiVersion()}`, data)
			.then((response: AxiosResponse<WiqlQueryResult>) => {
				return this.getWorkItemsByBatch(response.data.workItems.map((wi) => wi.id));
			});
	}

	getWorkItemsByBatch(ids: number[]): Promise<WorkItem[]> {
		const data: WorkItemBatchRequest = {
			ids: ids,
			fields: CommonWorkItemProperties
		};

		return this.axios
			.post(`${this.getBaseUrl()}/${this.getOrganizationName()}/${this.getProjectName()}/${this.endPoint}/workitemsbatch${this.getApiVersion()}`, data)
			.then((response) => {
				return (response.data as MultValueResponse<WorkItem>).value;
			});
	}
}
