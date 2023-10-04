/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

export const AUTH_PROVIDER_MOCKED_USER_DATA_CONFIG_TOKEN = new InjectionToken<{
  enabled: boolean;
  config: any;
}>('AUTH_PROVIDER_MOCKED_USER_DATA_CONFIG_TOKEN');
