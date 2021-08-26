import { BoardColumn } from './board-column.type';

export type Board = {
	id: string;
	url: string;
	name: string;
	columns: BoardColumn[];
	canEdit: boolean;
};
