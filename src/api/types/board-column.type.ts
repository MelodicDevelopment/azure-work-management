export type BoardColumn = {
	id: string;
	name: string;
	columnType: string;
	itemLimit: number;
	description?: string;
	isSplit?: boolean;
};
