import { InjectionToken } from '@angular/core';
import { AuthProviderService } from '../service/auth-provider.service';

export const AUTH_PROVIDER_SERVICE_TOKEN = new InjectionToken<AuthProviderService>(
  'AUTH_PROVIDER_SERVICE_TOKEN'
);
