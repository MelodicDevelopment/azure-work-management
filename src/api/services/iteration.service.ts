import { ApiBase } from '../api-base.class';
import { Iteration } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';

export class IterationService extends ApiBase<Iteration> {
	constructor() {
		super('_apis/work/teamsettings/iterations');
	}

	getCurrentIteration(): Promise<Iteration[]> {
		return this.axios
			.get(`${this.getBaseUrl()}/${this.getOrganizationName()}/${this.getProjectName()}/${this.getTeamName()}/${this.endPoint}${this.getApiVersion()}&$timeframe=current`)
			.then((response) => {
				return (response.data as MultValueResponse<Iteration>).value;
			});
	}
}
