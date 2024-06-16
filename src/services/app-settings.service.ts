import * as vscode from 'vscode';

export class AppSettingsService {

	public getProject() {
		return getAppSettings().get('project') as string;
	}
	public getTeam() {
		return getAppSettings().get('team') as string;
	}

	public getTeamContext() {
		return {
			project: this.getProject(),
			team: this.getTeam(),
		};
	}

	public isValidAppSettings() {
		const serverUrl: string = getAppSettings().get('serverUrl') as string;
		const organization: string = getAppSettings().get('organization') as string;
		const personalAccessToken: string = getAppSettings().get(
			'personalAccessToken',
		) as string;
		const project: string = getAppSettings().get('project') as string;
		const team: string = getAppSettings().get('team') as string;
		const iteration: string = getAppSettings().get('iteration') as string;
	
		if (
			serverUrl &&
			organization &&
			personalAccessToken &&
			project &&
			team &&
			iteration
		) {
			return true;
		}
	
		return false;
	};
}

export const getAppSettings = (): vscode.WorkspaceConfiguration =>
	vscode.workspace.getConfiguration('azure-work-management');
export const getOrganization = () =>
	encodeURI(getAppSettings().get('organization') as string);
export const getIteration = () => getAppSettings().get('iteration') as string;


