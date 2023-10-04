import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../variable/variables';
import { MockedUserDataAuthProviderService } from './service/mocked-user-data-auth-provider.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE_TOKEN,
      useExisting: MockedUserDataAuthProviderService,
      multi: true,
    },
    MockedUserDataAuthProviderService,
  ],
})
export class CoreAuthProviderMockedUserDataModule {}
