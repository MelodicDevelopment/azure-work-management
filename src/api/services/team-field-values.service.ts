import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';

export class TeamFieldValuesService {
	constructor(private _appSettingsService: AppSettingsService) {}
	async getTeamFieldValues() {
		const workApi = await getWebApi(this._appSettingsService).getWorkApi();
		return await workApi.getTeamFieldValues(
			this._appSettingsService.getTeamContext(),
		);
	}
}
