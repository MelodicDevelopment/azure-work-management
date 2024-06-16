import { getWebApi } from '../../services/api.service';
import { AppSettingsService } from '../../services/app-settings.service';

export class BoardService {
	constructor(private _appSettingsService: AppSettingsService) {}
	async getAll() {
		const workApi = await getWebApi(this._appSettingsService).getWorkApi();
		return await workApi.getBoards(this._appSettingsService.getTeamContext());
	}

	async getColumns(boardID: string) {
		const workApi = await getWebApi(this._appSettingsService).getWorkApi();
		const board = await workApi.getBoard(
			this._appSettingsService.getTeamContext(),
			boardID,
		);
		return board.columns!;
	}
}
