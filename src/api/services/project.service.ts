import { ApiBase } from '../api-base.class';

export class ProjectService extends ApiBase {
  async getProjects() {
    const coreApi = await this.webApi.getCoreApi();
    return coreApi.getProjects();
  }

  async getTeamsForProject(projectID: string) {
    const coreApi = await this.webApi.getCoreApi();
    return coreApi.getTeams(projectID);
  }
}
