import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../variable/variables';
import { Laravel9AuthProviderService } from './service/laravel9-auth-provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE_TOKEN,
      useExisting: Laravel9AuthProviderService,
      multi: true,
    },
    Laravel9AuthProviderService,
  ],
})
export class CoreAuthProviderLaravel9Module {}
