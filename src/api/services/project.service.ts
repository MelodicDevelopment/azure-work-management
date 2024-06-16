import { getWebApi } from '../../services/api.service';


export class ProjectService {
	async getProjects() {
		const coreApi = await getWebApi().getCoreApi();
		return coreApi.getProjects();
	}

	async getTeamsForProject(projectID: string) {
		const coreApi = await getWebApi().getCoreApi();
		return coreApi.getTeams(projectID);
	}
}
