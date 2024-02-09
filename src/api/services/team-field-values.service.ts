import { getAppSettings, getTeamContext } from '../../services';
import { ApiBase } from '../api-base.class';

export class TeamFieldValuesService extends ApiBase {
	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

	constructor() {
		super('_apis/work/teamsettings/teamfieldvalues');
	}

	async getTeamFieldValues() {
		const workApi = await this.webApi.getWorkApi();
		return await workApi.getTeamFieldValues(getTeamContext());
	}
}
