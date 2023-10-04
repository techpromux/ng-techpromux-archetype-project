/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
// import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { delay, firstValueFrom, map, of, take } from 'rxjs';
import { AuthProviderTypeModel } from '../../../../model/auth-provider-type.model';
import { AbstractAuthProviderService } from '../../abstract-auth-provider.service';
import { GoogleAuthInitializeConfigModel } from '../model/google.auth.initialize.config.model';
import { AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_CONFIG_TOKEN } from '../variable/variables';

@Injectable()
export class Oauth2SocialGoogleAuthProviderService extends AbstractAuthProviderService<GoogleAuthInitializeConfigModel> {
  protected providerAuthConfig: {
    enabled: boolean;
    config: any;
  } = inject<{
    enabled: boolean;
    config: any;
  }>(AUTH_PROVIDER_OAUTH2_SOCIAL_GOOGLE_CONFIG_TOKEN);

  constructor() {
    super();
  }

  public getProviderKey(): AuthProviderTypeModel | string {
    return AuthProviderTypeModel.OAUTH2_SOCIAL_GOOGLE;
  }

  public isEnabled(): boolean {
    return this.providerAuthConfig.enabled;
  }

  protected doConfigure(callback?: (data?: any) => void): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doConfigure');

    this.setAuthConfig(this.providerAuthConfig.config);

    return firstValueFrom(
      of(true).pipe(
        take(1),
        map((a) => {
          try {
            this.logger.console.debug(
              this.__classname,
              'GoogleAuth.initialize()'
            );
            GoogleAuth.initialize({
              clientId: this.authConfig.clientId,
              scopes: this.authConfig.scopes,
              grantOfflineAccess: this.authConfig.grantOfflineAccess,
            });
            this.logger.console.debug(
              this.__classname,
              'GoogleAuth.initialize() - ok'
            );
          } catch (error) {
            this.logger.console.error(
              this.__classname,
              'GoogleAuth.initialize() - error',
              error
            );
          }
          return true;
        }),
        delay(1000),
        map((a) => {
          return true;
        })
      )
    );

    /*
    const head = document.getElementsByTagName('head')[0] as HTMLHeadElement;

    let meta_client_id: HTMLMetaElement;

    if (document.getElementsByName('google-signin-client_id').length === 0) {
      meta_client_id = document.createElement('meta') as HTMLMetaElement;
      head.appendChild(meta_client_id);
    } else {
      meta_client_id = document.getElementsByName(
        'google-signin-client_id'
      )[0] as HTMLMetaElement;
    }

    meta_client_id.setAttribute('name', 'google-signin-client_id');
    meta_client_id.setAttribute('content', this.authConfig.clientId);

    let meta_scope: HTMLMetaElement;

    if (document.getElementsByName('google-signin-scope').length === 0) {
      meta_scope = document.createElement('meta') as HTMLMetaElement;
      head.appendChild(meta_scope);
    } else {
      meta_scope = document.getElementsByName(
        'google-signin-scope'
      )[0] as HTMLMetaElement;
    }

    meta_scope.setAttribute('name', 'google-signin-scope');
    meta_scope?.setAttribute('content', this.authConfig.scopes.join(' '));
    */

    /*
    return firstValueFrom( of(true)
      .pipe(
        take(1),
        map((a) => {
          this.logger.console.debug(this.__classname, 'GoogleAuth', GoogleAuth);
          try {
            this.logger.console.debug(this.__classname, 'GoogleAuth.init()');
            GoogleAuth.initialize();
            this.logger.console.debug(this.__classname, 'GoogleAuth.init() - ok');
          } catch (error) {
            this.logger.console.error(this.__classname, 'GoogleAuth.init()', error);
          }
          return true;
        }),
        delay(1000),
        map((a) => {
          return true;
        })
      ));
      */
  }

  protected doCheck(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doCheck');
    return Promise.resolve(true);
  }

  protected doLogin(data?: any): Promise<boolean | undefined> {
    this.logger.console.debug(this.__classname, 'doLogin');

    /*
      const googleLoginOptions = {
        scope: 'profile email',
      }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

      return this.socialAuthService
        .signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions)
        .then(
          (user: any) => {
            this.logger.console.debug(this.__classname, 'signIn -> ok', user);
            const userPayload: any = Object.assign({}, user);
            if (user?.authentication?.idToken) {
              const tokenInfo: any = this.getTokenDecodedData(user);

              userPayload.iat = tokenInfo.iat;
              userPayload.exp = tokenInfo.exp;
              userPayload.locale = tokenInfo.locale;
              userPayload.fullName = tokenInfo.name;
            }
            this.emitEventCallback(true, userPayload);
            return true;
          },
          (error: any) => {
            this.logger.console.error(this.__classname, error);
            this.emitEventCallback(false, null);
            return false;
          }
        );
        */

    return GoogleAuth.signIn().then(
      (user: User) => {
        this.logger.console.debug(this.__classname, 'signIn -> ok', user);
        const userPayload: any = Object.assign({}, user);
        if (user?.authentication?.idToken) {
          const tokenInfo: any = this.getTokenDecodedData(user);

          userPayload.iat = tokenInfo.iat;
          userPayload.exp = tokenInfo.exp;
          userPayload.locale = tokenInfo.locale;
          userPayload.fullName = tokenInfo.name;
        }
        this.emitLoginCallback(userPayload);
        return true;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        this.emitLogoutCallback(null);
        return false;
      }
    );
  }

  protected doLogout(data?: any): Promise<boolean> {
    /*
      return this.socialAuthService.signOut().then(
        (result: any) => {
          this.logger.console.debug(this.__classname, 'signOut -> ok', result);
          this.emitEventCallback(false, null);
          return true;
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          this.emitEventCallback(false, null);
          return false;
        }
      );
    */
    return GoogleAuth.signOut().then(
      (result: any) => {
        this.logger.console.debug(this.__classname, 'signOut -> ok', result);
        this.emitLogoutCallback(null);
        return true;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        this.emitLogoutCallback(null);
        return false;
      }
    );
  }

  protected doRefreshToken(data?: any): Promise<boolean> {
    return GoogleAuth.refresh().then(
      (result: any) => {
        this.logger.console.debug(this.__classname, 'refresh -> ok', result);
        const tokenInfo: any = this.getTokenDecodedData({
          authentication: result,
        });
        this.emitRefreshTokenCallback(tokenInfo);
        return true;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        this.emitLogoutCallback(null);
        return false;
      }
    );
  }

  protected getUserName(payload?: any): string | null {
    return payload?.email;
  }

  protected getUserRoles(payload?: any): string[] {
    return ['ROLE_USER'];
  }

  protected isLogged(payload?: any): boolean {
    return !!payload;
  }

  protected getEmail(payload?: any): string | null {
    return payload?.email;
  }

  protected getFirstName(payload?: any): string | null {
    return payload?.givenName;
  }

  protected getFullName(payload?: any): string | null {
    return payload?.name ? payload?.name : payload?.displayName;
  }

  protected getLastName(payload?: any): string | null {
    return payload?.familyName;
  }

  protected getPhotoUrl(payload?: any): string | null {
    return payload?.imageUrl;
  }

  protected getProviderAuthId(payload?: any): string | null {
    return payload?.id;
  }

  protected getToken(payload?: any): string | null {
    return payload?.authentication?.idToken
      ? payload?.authentication?.idToken
      : payload?.authentication?.accessToken;
  }

  protected getTokenId(payload?: any): string | null {
    return payload?.authentication?.idToken
      ? payload?.authentication?.idToken
      : payload?.authentication?.accessToken;
  }

  protected getAccessToken(payload?: any): string | null {
    return payload?.authentication?.accessToken
      ? payload?.authentication?.accessToken
      : payload?.authentication?.idToken;
  }

  protected getLocale(payload?: any): string | null {
    return payload?.locale;
  }

  protected getTokenExpiresIn(payload: any): number | null {
    return payload?.exp * 1000;
  }

  protected getTokenExpiresAt(payload: any): Date | null {
    /*
    const expiresAt = new Date(
      new Date().getTime() + Number.parseInt('' + payload?.exp * 1000)
    );
    */
    return new Date(payload?.exp * 1000);
  }

  protected getTokenType(payload: any): string | null {
    return 'Bearer';
  }

  protected getTokenAccessToken(payload: any): string | null {
    return payload?.authentication?.accessToken;
  }

  protected getTokenRefreshToken(payload: any): string | null {
    return payload?.authentication?.refreshToken;
  }

  protected doGetExtraData(payload?: any) {
    return payload;
  }
}
