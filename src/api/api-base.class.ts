import * as vscode from 'vscode';
import axios, { AxiosStatic } from 'axios';
import { getAppSettings } from '../services/app-settings.service';
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';

const getAuthorization = (): string => {
  const buffer: Buffer = Buffer.from(
    `:${getAppSettings().get('personalAccessToken')}`,
  );
  return buffer.toString('base64');
};

axios.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Accept: '*/*',
    'User-Agent': 'Azure Work Management VS Code Extension',
    Authorization: `Basic ${getAuthorization()}`,
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
Stack: ${error.stack}`,
      )
      .then((msg) => vscode.env.clipboard.writeText(msg as string));
  },
);

export class ApiBase {
  protected axios: AxiosStatic = axios;
  protected apiVersion: string = 'api-version=6.0';
  protected baseUrl: string = getAppSettings().get('serverUrl') as string;
  protected get organizationName(): string {
    return encodeURI(getAppSettings().get('organization') as string);
  }
  protected authHandler = getPersonalAccessTokenHandler(
    getAppSettings().get('personalAccessToken')!,
  );
  protected webApi = new WebApi(
    `${this.baseUrl}${this.organizationName}`,
    this.authHandler,
  );

  constructor(protected endPoint: string) {}
}
