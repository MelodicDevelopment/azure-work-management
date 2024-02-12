import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { JsonPatchDocument } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';
import { chunk } from 'lodash';
import { getTeamContext } from '../../services';
import { ApiBase } from '../api-base.class';
import { TeamFieldValue } from '../types';

export class WorkItemService extends ApiBase {
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

    const workItemTrackingApi = await this.webApi.getWorkItemTrackingApi();
    const workItems = await workItemTrackingApi.queryByWiql({
      query: data.query
    }, getTeamContext());

    const ids = workItems.workItems?.map(workItem => workItem.id).filter((id): id is number => typeof id === 'number') ?? [];
    return this.getWorkItems(ids);
  }

  async getWorkItems(ids: number[]) {
    if (ids.length === 0) {
      return [];
    }

    const workItemTrackingApi = await this.webApi.getWorkItemTrackingApi();
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

  async updateWorkItem(id: number, changes: JsonPatchDocument): Promise<WorkItem> {
    const workItemTrackingApi = await this.webApi.getWorkItemTrackingApi();
    return await workItemTrackingApi.updateWorkItem({}, changes, id);
  }
}
