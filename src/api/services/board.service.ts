import { ApiBase } from '../api-base.class';

export class BoardService extends ApiBase {
	constructor() {
		super('work/boards');
	}

	get<Board>(id: string): Promise<Board> {
		return super.get<Board>(id);
	}

	getAll<Board>(): Promise<Board[]> {
		return super.getAll();
	}
}
