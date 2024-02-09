import { AxiosResponse } from 'axios';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { chunk } from 'lodash';
import { getAppSettings } from '../../services';
import { ApiBase } from '../api-base.class';
import { TeamFieldValue } from '../types';
import { WiqlQueryResult } from '../types/wiql-query-result.type';

export class WorkItemService extends ApiBase {
  protected get projectName(): string {
    return encodeURI(getAppSettings().get('project') as string);
  }
  protected get teamName(): string {
    return encodeURI(getAppSettings().get('team') as string);
  }

  constructor() {
    super('_apis/wit');
  }

  async queryForWorkItems(
    iterationPath: string,
    areaPath: TeamFieldValue[],
    boardColumn: string,
    workItemTypes: string[],
  ): Promise<WorkItem[]> {
    const systemAreaPath: string = areaPath
      .map(
        (ap: TeamFieldValue): string =>
          `[System.AreaPath] ${ap.includeChildren ? 'UNDER' : '='} '${ap.value}'`,
      )
      .join(' OR ');
    const workItemType: string = workItemTypes
      .map((wit) => `[System.WorkItemType] = '${wit}'`)
      .join(' OR ');

    const data: { query: string } = {
      query: `SELECT [System.State], [System.Title] FROM WorkItems WHERE [System.IterationPath] = '${iterationPath}' AND (${systemAreaPath}) AND (${workItemType}) AND [System.BoardColumn] = '${boardColumn}' ORDER BY [State] Asc`,
    };

    return this.axios
      .post(
        `${this.baseUrl}${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}/wiql?${this.apiVersion}`,
        data,
      )
      .then((response: AxiosResponse<WiqlQueryResult>) => {
        return this.getWorkItems(response.data.workItems.map((wi) => wi.id));
      });
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

  async updateWorkItem(id: number, changes: unknown): Promise<WorkItem> {
    return this.axios
      .patch(
        `${this.baseUrl}${this.organizationName}/${this.projectName}/${this.endPoint}/workitems/${id}?${this.apiVersion}`,
        changes,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        },
      )
      .then((response) => {
        return response.data as WorkItem;
      });
  }
}
