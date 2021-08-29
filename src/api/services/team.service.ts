import { ApiBase } from '../api-base.class';
import { Team } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';

//https://dev.azure.com/{organization}/_apis/teams?

export class TeamService extends ApiBase {
	protected apiVersion: string = 'api-version=6.0-preview.3';

	constructor() {
		super('_apis/teams');
	}

	getTeams(): Promise<Team[]> {
		return this.axios.get(`${this.baseUrl}/${this.organizationName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Team>).value;
		});
	}
}
