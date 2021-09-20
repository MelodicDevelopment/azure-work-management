export type BacklogWorkItem = {
	rel: string;
	source: string;
	target: { id: number };
};

export type BacklogWorkItemResponse = {
	workItems: BacklogWorkItem[];
};
