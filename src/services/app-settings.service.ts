import * as vscode from 'vscode';

export const getAppSettings = (): vscode.WorkspaceConfiguration => vscode.workspace.getConfiguration('azure-work-management');
export const getProject = () => getAppSettings().get('project') as string;
export const getTeam = () => getAppSettings().get('team') as string;
export const getTeamContext = () => ({project: getProject(), team: getTeam()});
export const isValidAppSettings = (): boolean => {
	const serverUrl: string = getAppSettings().get('serverUrl') as string;
	const organization: string = getAppSettings().get('organization') as string;
	const personalAccessToken: string = getAppSettings().get('personalAccessToken') as string;
	const project: string = getAppSettings().get('project') as string;
	const team: string = getAppSettings().get('team') as string;
	const iteration: string = getAppSettings().get('iteration') as string;

	if (serverUrl && organization && personalAccessToken && project && team && iteration) {
		return true;
	}

	return false;
};
