export type WorkItemBatchRequest = {
	ids: number[];
	fields: string[];
};

export const CommonWorkItemProperties: string[] = [
	'System.Id',
	'System.Title',
	'System.AreaPath',
	'System.TeamProject',
	'System.IterationPath',
	'System.WorkItemType',
	'System.State',
	'System.Reason',
	'System.CreatedDate',
	'System.CreatedBy',
	'System.BoardColumn',
	'System.Description',
	'Microsoft.VSTS.Common.AcceptanceCriteria',
	'Custom.TechnicalNotes',
	'System.Tags'
];
