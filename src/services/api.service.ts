import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { AppSettingsService } from './app-settings.service';

export const getWebApi = (appSettingsService: AppSettingsService) => {
	return new WebApi(
		`${appSettingsService.getServerUrl()}${appSettingsService.getOrganization()}`,
		getPersonalAccessTokenHandler(appSettingsService.getPersonalAccessToken()!),
	);
};
