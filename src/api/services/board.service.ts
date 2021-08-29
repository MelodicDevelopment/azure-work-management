import { ApiBase } from '../api-base.class';
import { Board, Column } from '../types';
import { MultValueResponse } from '../types/multi-value-response.type';
import { getAppSettings } from '../../services';

export class BoardService extends ApiBase {
	protected projectName: string = getAppSettings().get('project') as string;
	protected teamName: string = getAppSettings().get('team') as string;

	constructor() {
		super('_apis/work/boards');
	}

	getAll(): Promise<Board[]> {
		return this.axios.get(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}?${this.apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<Board>).value;
		});
	}

	getColumns(boardID: string): Promise<Column[]> {
		return this.axios
			.get(`${this.baseUrl}/${this.organizationName}/${this.projectName}/${this.teamName}/${this.endPoint}/${boardID}/columns?${this.apiVersion}`)
			.then((response) => {
				return (response.data as MultValueResponse<Column>).value;
			});
	}
}
