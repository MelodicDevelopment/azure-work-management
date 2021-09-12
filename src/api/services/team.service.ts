import { ApiBase } from '../api-base.class';
import { Team, User } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';
import { UserIdentity } from '../types/user-identity.type';

export class TeamService extends ApiBase {
	protected apiVersion: string = 'api-version=6.0-preview.3';

	constructor() {
		super('_apis/teams');
	}

	getTeams(): Promise<Team[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Team>).value;
		});
	}

	getTeamMembers(projectName: string, teamName: string): Promise<User[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/_apis/projects/${projectName}/teams/${teamName}/members?api-version=6.0`).then((response) => {
			return (response.data as MultValueResponse<UserIdentity>).value.map((userIdentity) => userIdentity.identity);
		});
	}
}
