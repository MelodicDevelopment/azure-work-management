import { User } from './user.type';

export type WorkItem = {
	id: string;
	rev: number;
	fields: WorkItemFields;
	url: string;
};

export type WorkItemFields = {
	'System.Id': number;
	'System.AreaPath': string;
	'System.TeamProject': string;
	'System.IterationPath': string;
	'System.WorkItemType': string;
	'System.State': string;
	'System.Reason': string;
	'System.CreatedDate': string;
	'System.CreatedBy': User;
	'System.Title': string;
	'System.BoardColumn': string;
	'System.Description': string;
	'Microsoft.VSTS.Common.AcceptanceCriteria': string;
	'Custom.TechnicalNotes': string;
	'System.Tags': string;
};
