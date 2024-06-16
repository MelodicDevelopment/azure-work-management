import { AppSettingsService } from "../../services/app-settings.service";

export const mockAppSettingService = (valid: boolean) => ({
    getProject() {
        return 'test-project';
    },
    getTeam() {
        return 'test-team';
    },
    getTeamContext() {
        return {
            project: this.getProject(),
            team: this.getTeam(),
        };
    },
    isValidAppSettings() {
        return valid;
    },
    getServerUrl() {
        return 'test-url';
    },
    getPersonalAccessToken() {
        return 'test-token';
    },
    getOrganization() {
        return 'test-organization';
    },
    getIteration() {
        return 'test-iteration';
    },
}) as AppSettingsService;