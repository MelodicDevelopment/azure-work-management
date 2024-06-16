import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { JsonPatchDocument } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import { chunk } from 'lodash';
import { AppSettingsService } from '../../services/app-settings.service';

import { getWebApi } from '../../services/api.service';
import { TeamFieldValue } from '../types';

export class WorkItemService {
	constructor(private _appSettingsService: AppSettingsService) {}

	async queryForWorkItems(
		iterationPath: string,
		areaPath: TeamFieldValue[],
		boardColumn: string,
		workItemTypes: string[],
	) {
		const systemAreaPath: string = areaPath
			.map(
				(ap): string =>
					`[System.AreaPath] ${ap.includeChildren ? 'UNDER' : '='} '${ap.value}'`,
			)
			.join(' OR ');
		const workItemType: string = workItemTypes
			.map((wit) => `[System.WorkItemType] = '${wit}'`)
			.join(' OR ');

		const data: { query: string } = {
			query: `SELECT [System.State], [System.Title] FROM WorkItems WHERE [System.IterationPath] = '${iterationPath}' AND (${systemAreaPath}) AND (${workItemType}) AND [System.BoardColumn] = '${boardColumn}' ORDER BY [State] Asc`,
		};

		const workItemTrackingApi = await getWebApi().getWorkItemTrackingApi();
		const workItems = await workItemTrackingApi.queryByWiql(
			{
				query: data.query,
			},
			this._appSettingsService.getTeamContext(),
		);

		const ids =
			workItems.workItems
				?.map((workItem) => workItem.id)
				.filter((id): id is number => typeof id === 'number') ?? [];
		return this.getWorkItems(ids);
	}

	async getWorkItems(ids: number[]) {
		if (ids.length === 0) {
			return [];
		}

		const workItemTrackingApi = await getWebApi().getWorkItemTrackingApi();
		const chunks = chunk(ids, 200);

		const result: WorkItem[] = [];

		const workItemsPromises = chunks.map((idChunk) =>
			workItemTrackingApi.getWorkItems(idChunk),
		);

		for (const workItemPromise of workItemsPromises) {
			result.push(...(await workItemPromise));
		}

		return result;
	}

	async updateWorkItem(
		id: number,
		changes: JsonPatchDocument,
	): Promise<WorkItem> {
		const workItemTrackingApi = await getWebApi().getWorkItemTrackingApi();
		return await workItemTrackingApi.updateWorkItem({}, changes, id);
	}
}
