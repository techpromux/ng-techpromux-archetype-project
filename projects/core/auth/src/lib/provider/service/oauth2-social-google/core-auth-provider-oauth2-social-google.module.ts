import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../variable/variables';
import { Oauth2SocialGoogleAuthProviderService } from './service/oauth2-social-google-auth-provider.service';
/* import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
*/

@NgModule({
  imports: [
    CommonModule,
    // SocialLoginModule
  ],
  providers: [
    /*{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '798244175105-1cp1t6bln1sk2320ck9s239iig55c02t.apps.googleusercontent.com',
              {
                scope: 'profile email',
              } // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
      } as SocialAuthServiceConfig,
    },*/
    {
      provide: AUTH_PROVIDER_SERVICE_TOKEN,
      useExisting: Oauth2SocialGoogleAuthProviderService,
      multi: true,
    },
    Oauth2SocialGoogleAuthProviderService,
  ],
})
export class CoreAuthProviderOauth2SocialGoogleModule {}
