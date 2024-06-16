import * as vscode from 'vscode';

export class AppSettingsService {
	public getAppSettings() {
		return vscode.workspace.getConfiguration('azure-work-management');
	}

	public getServerUrl() {
		return encodeURI(this.getAppSettings().get('serverUrl') as string);
	}

	public getPersonalAccessToken() {
		return encodeURI(
			this.getAppSettings().get('personalAccessToken') as string,
		);
	}

	public getOrganization() {
		return encodeURI(this.getAppSettings().get('organization') as string);
	}

	public getIteration() {
		return this.getAppSettings().get('iteration') as string;
	}

	public getProject() {
		return this.getAppSettings().get('project') as string;
	}

	public getTeam() {
		return this.getAppSettings().get('team') as string;
	}

	public getTeamContext() {
		return {
			project: this.getProject(),
			team: this.getTeam(),
		};
	}

	public isValidAppSettings() {
		if (
			this.getServerUrl() &&
			this.getOrganization() &&
			this.getPersonalAccessToken() &&
			this.getProject() &&
			this.getTeam() &&
			this.getIteration()
		) {
			return true;
		} else {
			return false;
		}
	}
}
