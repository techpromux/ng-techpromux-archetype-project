import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../variable/variables';
import { SuiteCrm7AuthProviderService } from './service/suitecrm7-auth-provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE_TOKEN,
      useExisting: SuiteCrm7AuthProviderService,
      multi: true,
    },
    SuiteCrm7AuthProviderService,
  ],
})
export class CoreAuthProviderSuiteCrm7Module {}
