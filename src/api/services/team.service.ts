import { getWebApi } from '../../services/api.service';
import { getProject } from '../../services/app-settings.service';


export class TeamService {
	async getTeams() {
		const coreApi = await getWebApi().getCoreApi();
		return await coreApi.getTeams(getProject());
	}

	async getTeamMembers(projectName: string, teamName: string) {
		const coreApi = await getWebApi().getCoreApi();
		return await coreApi.getTeamMembersWithExtendedProperties(
			projectName,
			teamName,
		);
	}
}
