import * as vscode from 'vscode';
import axios, { AxiosStatic } from 'axios';
import { getAppSettings } from '../services/app-settings.service';

const getAuthorization = (): string => {
	const buffer: Buffer = Buffer.from(`:${getAppSettings().get('personal-access-token')}`);
	return buffer.toString('base64');
};

axios.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
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
	protected axios: AxiosStatic = axios;
	protected apiVersion: string = 'api-version=6.0';
	protected baseUrl: string = 'https://dev.azure.com/';
	protected get organizationName(): string {
		return getAppSettings().get('organization') as string;
	}

	constructor(protected endPoint: string) {}
}
