import { ApiBase } from '../api-base.class';
import { TeamFieldValues } from '../types';
import { appSettings } from '../../services';

export class TeamFieldValuesService extends ApiBase {
	protected projectName: string = appSettings.get('project') as string;
	protected teamName: string = appSettings.get('team') as string;

	constructor() {
		super('_apis/work/teamsettings/teamfieldvalues');
	}

	getTeamFieldValues(): Promise<TeamFieldValues> {
		return this.axios.get(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return response.data;
		});
	}
}
