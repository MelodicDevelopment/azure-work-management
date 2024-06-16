import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';

export class TeamService {
	constructor(private _appSettingsService: AppSettingsService) {}
	async getTeams() {
		const coreApi = await getWebApi().getCoreApi();
		return await coreApi.getTeams(this._appSettingsService.getProject());
	}

	async getTeamMembers(projectName: string, teamName: string) {
		const coreApi = await getWebApi().getCoreApi();
		return await coreApi.getTeamMembersWithExtendedProperties(
			projectName,
			teamName,
		);
	}
}
