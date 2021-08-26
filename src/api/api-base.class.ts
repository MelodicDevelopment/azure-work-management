import * as vscode from 'vscode';
import axios from 'axios';
import { MultValueResponse } from './types/multi-value-response.type';

// Azure DevOps Test PAT
// dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta
// rhopkins@nhaschools.com:dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta
// base64 = cmhvcGtpbnNAbmhhc2Nob29scy5jb206ZHY3aHRwbmhydzRla2lnazNrZ3ZpcDQ0YjdkYm1nZmhnaGFjM2pod3U3eWI1eXh1ZnB0YQ==

// config
// {
// 	organization: "nhaschools"
// 	personal-access-token: "dv7htpnhrw4ekigk3kgvip44b7dbmgfhghac3jhwu7yb5yxufpta"
// 	project: "School Apps"
// 	team: "Teacher Support"
// 	username: "rhopkins@nhaschools.com"
// }

const appSettings: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('azure-work-management');

const getAuthorization = (): string => {
	const buffer: Buffer = Buffer.from(`${appSettings.get('username')}:${appSettings.get('personal-access-token')}`);
	return buffer.toString('base64');
};

axios.interceptors.request.use((config) => {
	config.headers = {
		'Accept': '*/*',
		'User-Agent': 'Azure Work Management VS Code Extension',
		'Authorization': `Basic ${getAuthorization()}`
	};

	return config;
});

axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(errorResponse) => {
		const error = errorResponse.toJSON();

		vscode.window
			.showErrorMessage(
				`Azure API Request Failed`,
				`
Message: ${error.message}
Url: ${error.config.url}
Stack: ${error.stack}`
			)
			.then((msg) => vscode.env.clipboard.writeText(msg as string));
	}
);

export class ApiBase {
	private _apiVersion: string = '?api-version=6.0';
	private _baseUrl: string = 'https://dev.azure.com/';
	private _organizationName: string = appSettings.get('organization') as string;
	private _projectName: string = appSettings.get('project') as string;
	private _teamName: string = appSettings.get('team') as string;

	constructor(protected endPoint: string) {}

	getBaseUrl(): string {
		return this._baseUrl;
	}

	getOrganizationName(): string {
		return this._organizationName;
	}

	getProjectName(): string {
		return this._projectName;
	}

	getTeamName(): string {
		return this._teamName;
	}

	getApiVersion(): string {
		return this._apiVersion;
	}

	get<T>(id: string): Promise<T> {
		return axios.get(`${this._baseUrl}/${this._organizationName}/${this._projectName}/${this._teamName}/_apis/${this.endPoint}/${id}${this._apiVersion}`).then((response) => {
			return response.data;
		});
	}

	getAll<T>(): Promise<T[]> {
		return axios.get(`${this._baseUrl}/${this._organizationName}/${this._projectName}/${this._teamName}/_apis/${this.endPoint}${this._apiVersion}`).then((response) => {
			return (response.data as MultValueResponse<T>).value;
		});
	}
}
