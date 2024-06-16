import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';

export class ProjectService {
	constructor(private _appSettingsService: AppSettingsService) {}
	async getProjects() {
		const coreApi = await getWebApi(this._appSettingsService).getCoreApi();
		return coreApi.getProjects();
	}

	async getTeamsForProject(projectID: string) {
		const coreApi = await getWebApi(this._appSettingsService).getCoreApi();
		return coreApi.getTeams(projectID);
	}
}
