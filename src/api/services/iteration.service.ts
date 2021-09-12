import { ApiBase } from '../api-base.class';
import { Iteration } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';
import { getAppSettings } from '../../services';

export class IterationService extends ApiBase {
	protected get projectName(): string {
		return getAppSettings().get('project') as string;
	}
	protected get teamName(): string {
		return getAppSettings().get('team') as string;
	}

	constructor() {
		super('_apis/work/teamsettings/iterations');
	}

	getIterations(): Promise<Iteration[]> {
		return this.axios.get(`${this.baseUrl}${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Iteration>).value;
		});
	}

	getCurrentIteration(): Promise<Iteration[]> {
		return this.axios
			.get(`${this.baseUrl}${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}&$timeframe=current`)
			.then((response) => {
				return (response.data as MultValueResponse<Iteration>).value;
			});
	}
}
