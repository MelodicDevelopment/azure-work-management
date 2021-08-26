import { ApiBase } from '../api-base.class';
import { Board, Column } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';

export class BoardService extends ApiBase<Board> {
	constructor() {
		super('_apis/work/boards');
	}

	getColumns(boardID: string): Promise<Column[]> {
		return this.axios
			.get(`${this.getBaseUrl()}/${this.getOrganizationName()}/${this.getProjectName()}/${this.getTeamName()}/${this.endPoint}/${boardID}/columns${this.getApiVersion()}`)
			.then((response) => {
				return (response.data as MultValueResponse<Column>).value;
			});
	}
}
