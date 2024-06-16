import { getWebApi } from '../../services/api.service';
import {
	AppSettingsService,
	getAppSettings,
} from '../../services/app-settings.service';

export class BoardService {
	constructor(private _appSettingsService: AppSettingsService) {}
	protected get projectName(): string {
		return encodeURI(getAppSettings().get('project') as string);
	}
	protected get teamName(): string {
		return encodeURI(getAppSettings().get('team') as string);
	}

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
