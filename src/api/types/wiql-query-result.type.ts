export type WiqlQueryResult = {
	queryType: string;
	queryResultType: string;
	workItems: { id: number; url: string }[];
};
