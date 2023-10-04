/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import {
  AuthConfig,
  NullValidationHandler,
  OAuthService,
} from 'angular-oauth2-oidc';
import { AuthProviderTypeModel } from '../../../../model/auth-provider-type.model';
import { AbstractAuthProviderService } from '../../abstract-auth-provider.service';
import { AUTH_PROVIDER_OAUTH2_KEYCLOACK_CONFIG_TOKEN } from '../variable/variables';

@Injectable()
export class Oauth2KeycloakAuthProviderService extends AbstractAuthProviderService<AuthConfig> {
  protected oauthService: OAuthService = inject<OAuthService>(OAuthService);

  protected providerAuthConfig: {
    enabled: boolean;
    config: any;
  } = inject<{
    enabled: boolean;
    config: AuthConfig;
  }>(AUTH_PROVIDER_OAUTH2_KEYCLOACK_CONFIG_TOKEN);

  constructor() {
    super();
  }

  public getProviderKey(): AuthProviderTypeModel {
    return AuthProviderTypeModel.OAUTH2_KEYCLOAK;
  }

  public isEnabled(): boolean {
    return this.providerAuthConfig.enabled;
  }

  protected doConfigure(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doConfigure');

    this.setAuthConfig(this.providerAuthConfig.config);

    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();
    // this.oauthService.loadDiscoveryDocumentAndTryLogin()
    return this.oauthService
      .loadDiscoveryDocument()
      .then(
        ($event) => {
          return this.oauthService.tryLogin().then(
            (result: boolean) => {
              return true;
            },
            (error: any) => {
              this.logger.console.error(this.__classname, error);
              return false;
            }
          );
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          return false;
        }
      )
      .then(
        (result: boolean) => {
          if (this.oauthService.getIdentityClaims()) {
            const payload = this.getPayloadDecodedData();
            payload._previousState = this.oauthService.state
              ? JSON.parse(decodeURIComponent('' + this.oauthService.state))
              : null;
            this.emitLoginCallback(payload);
            return payload;
          } else {
            this.emitLogoutCallback(null);
            return null;
          }
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          return false;
        }
      );
  }

  private getPayloadDecodedData(data?: any): any {
    const token = this.oauthService.getAccessToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload); // from base64
    const payloadDecodedJson = JSON.parse(payloadDecoded);
    return payloadDecodedJson;
  }

  protected getExpireAt(payload?: any): Date | null {
    return payload?.exp;
  }

  protected isLogged(payload?: any): boolean {
    return (
      this.oauthService.hasValidIdToken() &&
      this.oauthService.hasValidAccessToken()
    );
  }

  protected getUserName(payload?: any): string | null {
    return payload?.preferred_username;
  }

  protected getUserRoles(payload?: any): string[] {
    if (!payload) {
      return [];
    }
    return payload.realm_access.roles.map(
      (role: string) => 'ROLE_' + role.replace('realm-', '').toLocaleUpperCase()
    );
  }

  protected doCheck(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doCheck');
    return Promise.resolve(true);
  }

  protected doLogin(data?: any): Promise<boolean | undefined> {
    // this.oauthService.initImplicitFlowInternal(
    this.oauthService.initLoginFlow(
      JSON.stringify(data?.additionalState),
      data?.params
    );
    return Promise.resolve(true);
  }

  protected doLogout(data?: any): Promise<boolean> {
    // this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout();
    // when is not oauth2
    // this.oauthService.revokeTokenAndLogout()
    return Promise.resolve(true);
  }

  protected doRefreshToken(data?: any): Promise<boolean> {
    return this.oauthService.refreshToken().then((result) => {
      const tokenInfo: any = this.getTokenDecodedData({
        token: result,
      });
      this.emitRefreshTokenCallback(tokenInfo);
      return true;
    });
  }

  protected getEmail(payload?: any): string | null {
    return payload?.email;
  }

  protected getFirstName(payload?: any): string | null {
    return payload?.given_name;
  }

  protected getFullName(payload?: any): string | null {
    return payload?.name;
  }

  protected getLastName(payload?: any): string | null {
    return payload?.family_name;
  }

  protected getPhotoUrl(payload?: any): string | null {
    return null;
  }

  protected getProviderAuthId(payload?: any): string | null {
    return payload?.sub;
  }

  protected getToken(payload?: any): string | null {
    return this.oauthService.getAccessToken();
  }

  protected getIdToken(payload?: any): string | null {
    return payload?.sid;
  }

  protected getAccessToken(payload?: any): string | null {
    return payload?.sid;
  }

  protected getLocale(payload?: any): string | null {
    return payload?.locale;
  }

  protected getTokenExpiresIn(payload: any): number | null {
    throw new Error('Method not implemented.');
  }

  protected getTokenExpiresAt(payload: any): Date | null {
    throw new Error('Method not implemented.');
  }

  protected getTokenType(payload: any): string | null {
    throw new Error('Method not implemented.');
  }

  protected getTokenId(payload: any): string | null {
    throw new Error('Method not implemented.');
  }

  protected getTokenAccessToken(payload: any): string | null {
    throw new Error('Method not implemented.');
  }

  protected getTokenRefreshToken(payload: any): string | null {
    throw new Error('Method not implemented.');
  }

  protected doGetExtraData(payload?: any) {
    throw new Error('Method not implemented.');
  }
}
