export interface IAppConfigVarsModel {
  // ----------------------------------
  // GENERAL
  // ----------------------------------
  APP_NAME: string;
  APP_PACKAGE_NAME: string;
  // ----------------------------------
  // LOGS
  // ----------------------------------
  LOGGER_LEVEL: string;
  LOGGER_SERVER_LEVEL: string;
  // ----------------------------------
  // CRYPTO
  // ----------------------------------
  UTIL_CRYPTO_SECRET_KEY: string;
  // ----------------------------------
  // API
  // ----------------------------------
  API_LARAVEL_BASE_PATH: string;
  API_SUITECRM_BASE_PATH: string;
  // ----------------------------------
  // AUTH
  // ----------------------------------
  AUTH_PROVIDER_LARAVEL9_ENABLED: boolean;
  AUTH_PROVIDER_LARAVEL9_TOKEN_REFRESH_TIME: number;
  // ----------------------------------
  AUTH_PROVIDER_SUITECRM7_ENABLED: boolean;
  AUTH_PROVIDER_SUITECRM7_CLIENT_ID: string;
  AUTH_PROVIDER_SUITECRM7_CLIENT_NAME: string;
  AUTH_PROVIDER_SUITECRM7_CLIENT_SECRET: string;
  AUTH_PROVIDER_SUITECRM7_USER_MODULE_NAME: string;
  AUTH_PROVIDER_SUITECRM7_TOKEN_REFRESH_TIME: number;
  // ----------------------------------
  AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_ENABLED: boolean;
  AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_ANDROID_CLIENT_ID: string;
  AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_WEB_CLIENT_ID: string;
  AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_SCOPES: string;
  AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_GRANT_OFFLINE_ACCESS: boolean;
  // ----------------------------------
  AUTH_PROVIDER_MOCKED_USER_DATA_ENABLED: boolean;
  // ----------------------------------
}

export interface IAppEnvConfig {
  production: boolean;
  envName: string;
  appVersion: string;
}
