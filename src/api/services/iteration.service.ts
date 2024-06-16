import { getWebApi } from '../../services/api.service';
import { getTeamContext } from '../../services/app-settings.service';


export class IterationService {
	async getIterations() {
		const workApi = await getWebApi().getWorkApi();
		return workApi.getTeamIterations(getTeamContext());
	}

	async getCurrentIteration() {
		const workApi = await getWebApi().getWorkApi();
		return workApi.getTeamIterations(getTeamContext(), 'current');
	}
}
