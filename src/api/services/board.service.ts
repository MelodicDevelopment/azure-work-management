import { getWebApi } from '../../services/api.service';
import {
	getAppSettings,
	getTeamContext,
} from '../../services/app-settings.service';

export class BoardService {
	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

	async getAll() {
		const workApi = await getWebApi().getWorkApi();
		return await workApi.getBoards(getTeamContext());
	}

	async getColumns(boardID: string) {
		const workApi = await getWebApi().getWorkApi();
		const board = await workApi.getBoard(getTeamContext(), boardID);
		return board.columns!;
	}
}
