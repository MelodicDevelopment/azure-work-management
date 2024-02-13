import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { getAppSettings } from '../services/app-settings.service';

export class ApiBase {
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
}
