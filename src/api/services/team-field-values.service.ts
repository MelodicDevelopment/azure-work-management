import { ApiBase } from '../api-base.class';
import { TeamFieldValues } from '../types';
import { getAppSettings } from '../../services';

export class TeamFieldValuesService extends ApiBase {
	protected projectName: string = getAppSettings().get('project') as string;
	protected teamName: string = getAppSettings().get('team') as string;

	constructor() {
		super('_apis/work/teamsettings/teamfieldvalues');
	}

	getTeamFieldValues(): Promise<TeamFieldValues> {
		return this.axios.get(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return response.data;
		});
	}
}
