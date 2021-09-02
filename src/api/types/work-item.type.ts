import { User } from './user.type';

export type WorkItem = {
	id: number;
	rev: number;
	fields: WorkItemFields;
	relations: WorkItemRelation[];
	url: string;
};

export type WorkItemRelation = {
	rel: string;
	url: string;
	attributes: { name: string };
};

export type WorkItemFields = {
	'System.Id': number;
	'System.AreaId': number;
	'System.AreaPath': string;
	'System.TeamProject': string;
	'System.NodeName': string;
	'System.AreaLevel1': string;
	'System.AreaLevel2': string;
	'System.Rev': number;
	'System.AuthorizedDate': string;
	'System.RevisedDate': string;
	'System.IterationId': number;
	'System.IterationPath': string;
	'System.IterationLevel1': string;
	'System.IterationLevel2': string;
	'System.IterationLevel3': string;
	'System.WorkItemType': string;
	'System.State': string;
	'System.Reason': string;
	'System.CreatedDate': string;
	'System.CreatedBy': User;
	'System.ChangedDate': string;
	'System.ChangedBy': User;
	'System.AuthorizedAs': User;
	'System.PersonId': number;
	'System.Watermark': number;
	'System.CommentCount': number;
	'System.Title': string;
	'System.BoardColumn': string;
	'System.BoardColumnDone': boolean;
	'System.AssignedTo': User;
	'Microsoft.VSTS.Scheduling.StoryPoints': number;
	'Microsoft.VSTS.Common.StateChangeDate': string;
	'Microsoft.VSTS.Common.Priority': number;
	'Microsoft.VSTS.Common.StackRank': number;
	'Microsoft.VSTS.Common.ValueArea': string;
	'System.Description': string;
	'Microsoft.VSTS.Common.AcceptanceCriteria': string;
	'Custom.TechnicalNotes': string;
	'System.Tags': string;
	'System.Parent': number;
};
