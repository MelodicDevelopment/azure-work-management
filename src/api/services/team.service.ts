import { getProject } from '../../services';
import { ApiBase } from '../api-base.class';

export class TeamService extends ApiBase {
	async getTeams() {
		const coreApi = await this.webApi.getCoreApi();
		return await coreApi.getTeams(getProject());
	}

	async getTeamMembers(projectName: string, teamName: string) {
		const coreApi = await this.webApi.getCoreApi();
		return await coreApi.getTeamMembersWithExtendedProperties(
			projectName,
			teamName,
		);
	}
}
