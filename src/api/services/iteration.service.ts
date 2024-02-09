import { getTeamContext } from '../../services';
import { ApiBase } from '../api-base.class';

export class IterationService extends ApiBase {
  constructor() {
    super('_apis/work/teamsettings/iterations');
  }

  async getIterations() {
    const workApi = await this.webApi.getWorkApi();
    return workApi.getTeamIterations(getTeamContext());
  }

  async getCurrentIteration() {
    const workApi = await this.webApi.getWorkApi();
    return workApi.getTeamIterations(getTeamContext(), 'current');
  }
}
