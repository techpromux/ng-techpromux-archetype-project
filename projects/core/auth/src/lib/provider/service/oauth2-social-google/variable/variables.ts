/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

export const AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_CONFIG_TOKEN =
  new InjectionToken<{
    enabled: boolean;
    config: any;
  }>('AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_CONFIG_TOKEN');
