/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

import { AuthManagerService } from '../service/auth-manager.service';

export const AUTH_MANAGER_SERVICE_TOKEN = new InjectionToken<AuthManagerService>(
  'AUTH_MANAGER_SERVICE_TOKEN'
);

export const AUTH_MANAGER_DEFAULT_CONFIG_TOKEN = new InjectionToken<any>(
  'AUTH_MANAGER_DEFAULT_CONFIG_TOKEN'
);
