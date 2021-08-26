import { ApiBase } from '../api-base.class';
import { WorkItem } from '../types';

//https://dev.azure.com/{organization}/{project}/{team}/_apis/wit/wiql?api-version=6.0

export class WorkItemService extends ApiBase<WorkItem> {
	constructor() {
		super('_apis/wit');
	}
}
