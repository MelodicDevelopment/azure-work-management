import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';

export class IterationService {
	constructor(private _appSettingsService: AppSettingsService) {}
	async getIterations() {
		const workApi = await getWebApi().getWorkApi();
		return workApi.getTeamIterations(this._appSettingsService.getTeamContext());
	}

	async getCurrentIteration() {
		const workApi = await getWebApi().getWorkApi();
		return workApi.getTeamIterations(this._appSettingsService.getTeamContext(), 'current');
	}
}
