import { Column } from './column.type';

export type Board = {
	id: string;
	url: string;
	name: string;
	columns: Column[];
	canEdit: boolean;
};
