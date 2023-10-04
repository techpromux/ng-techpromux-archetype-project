/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { AuthProviderTypeModel } from '../../../../model/auth-provider-type.model';
import { AbstractAuthProviderService } from '../../abstract-auth-provider.service';
import { AUTH_PROVIDER_MOCKED_USER_DATA_CONFIG_TOKEN } from '../variable/variables';

@Injectable()
export class MockedUserDataAuthProviderService extends AbstractAuthProviderService<any> {
  private _isLogged = false;

  protected providerAuthConfig: {
    enabled: boolean;
    config: any;
  } = inject<{
    enabled: boolean;
    config: any;
  }>(AUTH_PROVIDER_MOCKED_USER_DATA_CONFIG_TOKEN);

  constructor() {
    super();
  }

  // -----------------------------------------------------------------

  public getProviderKey(): AuthProviderTypeModel {
    return AuthProviderTypeModel.MOCKED_USER_DATA;
  }

  public isEnabled(): boolean {
    return this.providerAuthConfig.enabled;
  }

  // -----------------------------------------------------------------

  protected doConfigure(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doConfigure', data);

    this.setAuthConfig({});
    if (data) {
      const payload = data;
      this.emitLoginCallback(payload);
      return Promise.resolve(true);
    } else {
      this.emitLogoutCallback(null);
      return Promise.resolve(false);
    }
  }

  // -----------------------------------------------------------------

  protected doCheck(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doCheck');
    return Promise.resolve(true);
  }

  protected doLogin(data?: any): Promise<boolean | undefined> {
    this._isLogged = true;
    this.emitLoginCallback(data);
    return Promise.resolve(true);
  }

  protected doLogout(data?: any): Promise<boolean> {
    this._isLogged = false;
    this.emitLogoutCallback(null);
    return Promise.resolve(true);
  }

  protected doRefreshToken(data?: any): Promise<boolean> {
    this.emitRefreshTokenCallback(data);
    return Promise.resolve(true);
  }

  // -----------------------------------------------------------------

  protected getUserName(payload?: any): string | null {
    return payload?.username ? payload?.username : 'anonymous';
  }

  protected getUserRoles(payload?: any): string[] {
    return payload?.roles ? payload?.roles : ['ROLE_USER', 'ROLE_ADMIN'];
  }

  protected getPayload(data?: any): any {
    return data;
  }

  protected isLogged(payload?: any): boolean {
    return this._isLogged;
  }

  protected getEmail(payload?: any): string | null {
    return payload?.email ? payload?.email : 'anonymous@localhost.com';
  }

  protected getFirstName(payload?: any): string | null {
    return payload?.firstname ? payload?.firstname : 'Anonymous';
  }

  protected getFullName(payload?: any): string | null {
    return payload?.fullname ? payload?.fullname : 'Anonymous';
  }

  protected getLastName(payload?: any): string | null {
    return payload?.lastname ? payload?.lastname : 'anonymous';
  }

  protected getPhotoUrl(payload?: any): string | null {
    return this._isLogged
      ? 'assets/img/user-profile/user-no-photo.png'
      : '';
  }

  protected getProviderAuthId(payload?: any): string | null {
    return this._isLogged ? 'anonymous' : null;
  }

  protected getToken(payload?: any): string | null {
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQwZjBmZDNiZTNiYTdmN2EyYjVjYmFhOWI5MmRlMjk0Y2UzY2FhZTg3Nzk3MWQwYWMwMmFlNGM0ZmQzNWE2ZTg1N2NhZWJiOGNhMTYzYWJkIn0.eyJhdWQiOiJhZTVkNzNlNS1lYTNjLWFmZWEtYjc3OS01ZTM0NmMxNTJkOGYiLCJqdGkiOiI0MGYwZmQzYmUzYmE3ZjdhMmI1Y2JhYTliOTJkZTI5NGNlM2NhYWU4Nzc5NzFkMGFjMDJhZTRjNGZkMzVhNmU4NTdjYWViYjhjYTE2M2FiZCIsImlhdCI6MTYyMDQwMDc1MSwibmJmIjoxNjIwNDAwNzUxLCJleHAiOjE2MjA0MDQzNTAsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.gHs5r4CRX6ZNB2T8LwjPQJdSFnW4c7WvVxCbIhkX-ur4cf7iZcYQsb4UxeHuWHUQxdt91FvasVxM8bt5JabiwlzNi_Wr4m3lcrcLpsVjRwLmuZPc0WLoY5eQnax0MztYCcKYpAd2qHWRZ1fw7kQdfuvJF1qixpViwy9EbYvxpm98UGgm6jpMgqR6IZlb-13tAeJWHKBZcuctIxq1n4Rrx3u1_mypimeaodqyrhFaCSGJeAGDzQPStA-IgiWCCEOl6yXhsCW8K0zesG1fmH-wLuKegOkIFQSg9F2Okenz2fkQ0083D3x1MGIGsvtKafNFQo9n8XvAxuPriDJ9avLYJg';
  }

  protected getLocale(payload?: any): string | null {
    return 'es';
  }

  protected getTokenExpiresIn(payload: any): number | null {
    return null;
  }

  protected getTokenExpiresAt(payload: any): Date | null {
    return null;
  }

  protected getTokenType(payload: any): string | null {
    return null;
  }

  protected getTokenId(payload: any): string | null {
    return null;
  }

  protected getTokenAccessToken(payload: any): string | null {
    return null;
  }

  protected getTokenRefreshToken(payload: any): string | null {
    return null;
  }

  protected doGetExtraData(payload?: any) {
    return null;
  }
}
