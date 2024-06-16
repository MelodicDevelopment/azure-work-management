import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import {
	getAppSettings,
	getOrganization,
} from './app-settings.service';
const getBaseUrl = () => getAppSettings().get('serverUrl') as string;
const getAuthHandler = () => getPersonalAccessTokenHandler(
		getAppSettings().get('personalAccessToken')!,
	);

export const getWebApi = () => new WebApi(`${getBaseUrl()}${getOrganization()}`, getAuthHandler());

