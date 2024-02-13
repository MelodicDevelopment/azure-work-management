import { getAppSettings, getTeamContext } from '../../services';
import { ApiBase } from '../api-base.class';

export class BoardService extends ApiBase {
	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

	async getAll() {
		const workApi = await this.webApi.getWorkApi();
		return await workApi.getBoards(getTeamContext());
	}

	async getColumns(boardID: string) {
		const workApi = await this.webApi.getWorkApi();
		const board = await workApi.getBoard(getTeamContext(), boardID);
		return board.columns!;
	}
}
