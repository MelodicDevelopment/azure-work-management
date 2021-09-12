import { ApiBase } from '../api-base.class';
import { Project, Team } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';

export class ProjectService extends ApiBase {
	constructor() {
		super('_apis/projects');
	}

	getProjects(): Promise<Project[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Project>).value;
		});
	}

	getTeamsForProject(projectID: string): Promise<Team[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/${this.endPoint}/${projectID}/teams?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Team>).value;
		});
	}
}
