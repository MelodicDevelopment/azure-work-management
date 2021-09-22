export type Column = {
	id: string;
	name: string;
	columnType: string;
	itemLimit: number;
	description?: string;
	isSplit?: boolean;
	stateMappings: {
		[key: string]: string;
	};
};
