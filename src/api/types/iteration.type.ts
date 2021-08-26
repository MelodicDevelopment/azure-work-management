export type Iteration = {
	id: string;
	name: string;
	path: string;
	attributes: IterationAttributes;
	url: string;
};

export type IterationAttributes = {
	startDate: string;
	finishDate: string;
	timeFrame: string;
};
