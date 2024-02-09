import { getAppSettings, getTeamContext } from '../../services';
import { ApiBase } from '../api-base.class';

export class TeamFieldValuesService extends ApiBase {
  async getTeamFieldValues() {
    const workApi = await this.webApi.getWorkApi();
    return await workApi.getTeamFieldValues(getTeamContext());
  }
}
