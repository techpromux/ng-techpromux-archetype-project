import { InjectionToken } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

export const AUTH_PROVIDER_OAUTH2_KEYCLOACK_CONFIG_TOKEN = new InjectionToken<{
  enabled: boolean;
  config: AuthConfig;
}>('AUTH_PROVIDER_OAUTH2_KEYCLOACK_CONFIG_TOKEN');
