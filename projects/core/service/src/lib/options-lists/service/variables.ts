import { InjectionToken } from '@angular/core';
import { OptionsListsManagerService } from './manager/options-lists-manager.service';
import { OptionsListsProviderService } from './provider/options-lists-provider.service';

export const OPTIONS_LISTS_MANAGER_SERVICE_TOKEN =
  new InjectionToken<OptionsListsManagerService>(
    'OPTIONS_LISTS_MANAGER_SERVICE_TOKEN'
  );

export const OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN =
  new InjectionToken<OptionsListsProviderService>(
    'OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN'
  );
