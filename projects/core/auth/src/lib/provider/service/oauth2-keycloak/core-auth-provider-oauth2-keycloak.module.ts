import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../variable/variables';
import { Oauth2KeycloakAuthProviderService } from './service/oauth2-keycloak-auth-provider.service';

@NgModule({
  imports: [
    CommonModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [
          // APP_API_CONFIG.BASE_PATH + '/',
        ],
        sendAccessToken: true,
      },
    }),
  ],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE_TOKEN,
      useExisting: Oauth2KeycloakAuthProviderService,
      multi: true,
    },
    Oauth2KeycloakAuthProviderService,
  ],
})
export class CoreAuthProviderOauth2KeycloakModule {}
