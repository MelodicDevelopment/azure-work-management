export type TeamFieldValues = {
	field: { referenceName: string; url: string };
	defaultValue: string;
	values: TeamFieldValue[];
	url: string;
};

export type TeamFieldValue = {
	value: string;
	includeChildren: boolean;
};
