import * as vscode from 'vscode';

export const getAppSettings = (): vscode.WorkspaceConfiguration => vscode.workspace.getConfiguration('azure-work-management');

export const isValidAppSettings = (): boolean => {
	const organization: string = getAppSettings().get('organization') as string;
	const personalAccessToken: string = getAppSettings().get('personal-access-token') as string;
	const project: string = getAppSettings().get('project') as string;
	const team: string = getAppSettings().get('team') as string;
	const iteration: string = getAppSettings().get('iteration') as string;

	if (organization && personalAccessToken && project && team && iteration) {
		return true;
	}

	return false;
};
