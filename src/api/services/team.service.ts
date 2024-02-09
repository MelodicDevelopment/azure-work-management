import { getProject, getTeam } from '../../services';
import { ApiBase } from '../api-base.class';

export class TeamService extends ApiBase {
	protected apiVersion: string = 'api-version=6.0-preview.3';

	constructor() {
		super('_apis/teams');
	}

	async getTeams() {
		const coreApi = await this.webApi.getCoreApi();
		return await coreApi.getTeams(getProject());
	}

	async getTeamMembers(projectName: string, teamName: string) {
		const coreApi = await this.webApi.getCoreApi();
		return await coreApi.getTeamMembersWithExtendedProperties(projectName, teamName);
	}
}
