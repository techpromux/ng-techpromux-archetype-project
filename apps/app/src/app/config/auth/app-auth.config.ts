import { APP_API_CONFIG } from '../api/app-api.config';
import { APP_CONFIG_VARS } from '../config_vars/app-config-vars.config';

export const APP_AUTH_CONFIG = {
  providers: {
    LARAVEL9: {
      enabled: APP_CONFIG_VARS.AUTH_PROVIDER_LARAVEL9_ENABLED,
      config: {
        base_path: APP_API_CONFIG.laravel9_api_base_path,
        token_refresh_time:
          APP_CONFIG_VARS.AUTH_PROVIDER_LARAVEL9_TOKEN_REFRESH_TIME,
      },
    },
    SUITECRM7: {
      enabled: APP_CONFIG_VARS.AUTH_PROVIDER_SUITECRM7_ENABLED,
      config: {
        base_path: APP_API_CONFIG.suitecrm7_api_base_path,
        client_id: APP_CONFIG_VARS.AUTH_PROVIDER_SUITECRM7_CLIENT_ID,
        client_secret: APP_CONFIG_VARS.AUTH_PROVIDER_SUITECRM7_CLIENT_SECRET,
        user_module_name:
          APP_CONFIG_VARS.AUTH_PROVIDER_SUITECRM7_USER_MODULE_NAME,
        token_refresh_time:
          APP_CONFIG_VARS.AUTH_PROVIDER_SUITECRM7_TOKEN_REFRESH_TIME,
      },
    },
    OAUTH2_SOCIAL_GOOGLE: {
      enabled: APP_CONFIG_VARS.AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_ENABLED,
      config: {
        androidClientId:
          APP_CONFIG_VARS.AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_ANDROID_CLIENT_ID,
        clientId:
          APP_CONFIG_VARS.AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_WEB_CLIENT_ID,
        scopes: APP_CONFIG_VARS.AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_SCOPES.split(
          ','
        ).map((i) => i.trim()),
        grantOfflineAccess:
          APP_CONFIG_VARS.AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_GRANT_OFFLINE_ACCESS,
      },
    },
    MOCKED_USER_DATA: {
      enabled: APP_CONFIG_VARS.AUTH_PROVIDER_MOCKED_USER_DATA_ENABLED,
    },
  },
};
