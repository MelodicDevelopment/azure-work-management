import { ApiBase } from '../api-base.class';
import { TeamFieldValues } from '../types';

export class TeamFieldValuesService extends ApiBase<TeamFieldValues> {
	constructor() {
		super('_apis/work/teamsettings/teamfieldvalues');
	}

	getTeamFieldValues(): Promise<TeamFieldValues> {
		return this.axios
			.get(`${this.getBaseUrl()}/${this.getOrganizationName()}/${this.getProjectName()}/${this.getTeamName()}/${this.endPoint}${this.getApiVersion()}`)
			.then((response) => {
				return response.data;
			});
	}
}
