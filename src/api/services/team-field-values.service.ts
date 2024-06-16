import { getWebApi } from '../../services/api.service';
import { getTeamContext } from '../../services/app-settings.service';

export class TeamFieldValuesService {
	async getTeamFieldValues() {
		const workApi = await getWebApi().getWorkApi();
		return await workApi.getTeamFieldValues(getTeamContext());
	}
}
