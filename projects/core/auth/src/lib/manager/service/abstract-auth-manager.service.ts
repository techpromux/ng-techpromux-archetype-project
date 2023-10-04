/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';

import { Store } from '@ngxs/store';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { firstValueFrom } from 'rxjs';
import { AuthFullStoreModel } from '../../model/auth-full-data.model';
import { AuthPayloadModel } from '../../model/auth-payload.model';
import { AuthProviderModel } from '../../model/auth-provider.model';
import { AuthTokenModel } from '../../model/auth-token.model';
import { AuthUserStoreModel } from '../../model/auth-user-data.model';
import { AuthUserPermissionsModel } from '../../model/auth-user-permissions.model';
import { AuthProviderService } from '../../provider/service/auth-provider.service';
import { AUTH_PROVIDER_SERVICE_TOKEN } from '../../provider/variable/variables';
import { AuthChangeExtraDataStoreAction } from '../../store/action/auth-change-extra-data-store.action';
import { AuthChangeIsDataLoadedFromStorageStoreAction } from '../../store/action/auth-change-is-data-loaded-from-storage-store.action';
import { AuthChangePayloadStoreAction } from '../../store/action/auth-change-payload-store.action';
import { AuthChangeProviderStoreAction } from '../../store/action/auth-change-provider-store.action';
import { AuthChangeTokenStoreAction } from '../../store/action/auth-change-token-store.action';
import { AuthChangeUserDataStoreAction } from '../../store/action/auth-change-user-data-store.action';
import { AuthChangeUserPermissionsStoreAction } from '../../store/action/auth-change-user-permissions-store.action';
import { AuthDoLoginSuccessfullyStoreAction } from '../../store/action/auth-do-login-successfully-store.action';
import { AuthDoLogoutSuccessfullyStoreAction } from '../../store/action/auth-do-logout-successfully-store.action';
import { AuthStoreState } from '../../store/state/auth-store.state';
import { AuthManagerService } from './auth-manager.service';

export abstract class AbstractAuthManagerService
  extends AbstractService
  implements AuthManagerService
{
  protected store: Store = inject<Store>(Store);

  protected defaultProvider: AuthProviderService | null = null;

  protected providers: AuthProviderService[] = inject<AuthProviderService[]>(
    AUTH_PROVIDER_SERVICE_TOKEN
  );

  constructor() {
    super();
  }

  // ------------------------------------------------------------------------------

  public init(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'init', data);

    this.providers.forEach((provider: AuthProviderService) => {
      provider.setAuthManagerService(this);
    });

    const defaultProviderFromStore =
      this.store.selectSnapshot<AuthProviderModel | null>(
        AuthStoreState.getProvider
      );

    this.logger.console.debug(
      this.__classname,
      'defaultProviderFromStore',
      defaultProviderFromStore?.providerId
    );

    const defaultPayloadFromStore =
      this.store.selectSnapshot<AuthPayloadModel | null>(
        AuthStoreState.getPayload
      );

    this.logger.console.debug(
      this.__classname,
      'defaultPayloadFromStore',
      defaultPayloadFromStore
    );

    const defaultProviderFromStoreIsEnabled =
      this.checkIfDefaultProviderIsEnabled(
        defaultProviderFromStore ? defaultProviderFromStore.providerId : null
      );

    this.logger.console.debug(
      this.__classname,
      'defaultProviderFromStoreIsEnabled',
      defaultProviderFromStoreIsEnabled
    );

    let configureAsDefaultProviderId = defaultProviderFromStore?.providerId;
    let configureAsDefaultAuthData = defaultPayloadFromStore;
    let defaultProviderFromStoreIsMissing = false;

    if (!defaultProviderFromStore || !defaultProviderFromStoreIsEnabled) {
      defaultProviderFromStoreIsMissing = true;

      this.logger.console.debug(
        this.__classname,
        'defaultProviderFromStoreIsMissing',
        defaultProviderFromStoreIsMissing
      );

      configureAsDefaultProviderId = this.providers[0]?.getProviderKey();
      configureAsDefaultAuthData = null;

      this.logger.console.debug(
        this.__classname,
        'defaultProviderFromStoreIsMissing',
        defaultProviderFromStoreIsMissing
      );
    }

    if (!configureAsDefaultProviderId) {
      this.logger.console.error(
        this.__classname,
        'configureAsDefaultProviderId',
        configureAsDefaultProviderId
      );
      return Promise.resolve(false);
    }

    return this.configureAsDefault(
      configureAsDefaultProviderId,
      configureAsDefaultAuthData
    ).then(
      (result: boolean) => {
        this.logger.console.debug(this.__classname, 'init -> finished');

        if (defaultProviderFromStoreIsMissing) {
          const isLogged = this.store.selectSnapshot<boolean | null>(
            AuthStoreState.isLogged
          );

          this.logger.console.debug(
            this.__classname,
            'isLogged -> isLogged',
            isLogged
          );

          if (isLogged) {
            this.logger.console.debug(
              this.__classname,
              'defaultProviderFromStoreIsMissing -> dispatchLogoutAuthData()'
            );

            this.dispatchLogoutAuthData({});

            this.dispatchLogoutSuccessfully();
          }
        }

        return result;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  protected checkIfDefaultProviderIsEnabled(
    defaultProviderKey: string | null
  ): boolean {
    this.logger.console.debug(
      this.__classname,
      'checkIfDefaultProviderIsEnabled',
      defaultProviderKey
    );

    let defaultProviderEnabled = false;

    this.providers.forEach((provider: AuthProviderService) => {
      if (this.isProviderEnabled(provider.getProviderKey())) {
        this.logger.console.debug(
          this.__classname,
          'checkIfDefaultProviderIsEnabled -> provider.getProviderKey(), isDefault',
          provider.getProviderKey(),
          defaultProviderKey === provider.getProviderKey()
        );

        defaultProviderEnabled =
          defaultProviderEnabled ||
          defaultProviderKey === provider.getProviderKey();
      }
    });

    return defaultProviderEnabled;
  }

  /*
  protected initialSetupForAuthData(defaultAuthData: any | null): void {
    const provider = this.getCurrentProvider();
    if (provider && defaultAuthData) {
      try {
        this.dispatchAuthData(true, this.getPayload(), true);
      } catch (e) {
        this.logger.console.error(this.__classname, e);
      }
    } else {
      this.dispatchAuthData(false, null, true);
    }
  }*/

  // ------------------------------------------------------------------------------

  public isProviderEnabled(providerKey: string): boolean {
    const provider = this.providers.find(
      (p) => p.getProviderKey().toUpperCase() === providerKey.toUpperCase()
    );
    return !!(provider && provider.isEnabled());
  }

  public getDefaultProvider(): AuthProviderService | null {
    return this.defaultProvider ? this.defaultProvider : null;
  }

  // ------------------------------------------------------------------------------

  public configureAsDefault(
    defaultProviderKey: string | null,
    defaultAuthData: any | null = null
  ): Promise<boolean> {
    this.logger.console.debug(
      this.__classname,
      'configureAsDefault',
      defaultProviderKey,
      defaultAuthData
    );

    if (!defaultProviderKey || !this.isProviderEnabled(defaultProviderKey)) {
      return Promise.reject(
        'Provider [' + defaultProviderKey + '] Not Available!!!'
      );
    }

    this.logger.console.debug(
      this.__classname,
      'configureAsDefault -> setIsDefault',
      false
    );

    this.providers
      .filter(
        (p) =>
          p.getProviderKey().toUpperCase() !== defaultProviderKey?.toUpperCase()
      )
      .forEach((p) => {
        p.setIsDefault(false, null);
      });

    const provider = this.providers.find(
      (p) =>
        p.getProviderKey().toUpperCase() === defaultProviderKey?.toUpperCase()
    );

    if (!defaultProviderKey || !provider) {
      this.defaultProvider = null;
      this.store.dispatch(
        new AuthChangeProviderStoreAction({
          providerId: null,
        })
      );
      return Promise.reject(
        'Provider [' + defaultProviderKey + '] Not Available!!!'
      );
    }

    this.logger.console.debug(
      this.__classname,
      'configureAsDefault -> setIsDefault',
      true,
      defaultAuthData
    );

    this.defaultProvider = provider;

    return this.defaultProvider.setIsDefault(true, defaultAuthData).then(
      () => {
        this.store.dispatch(
          new AuthChangeProviderStoreAction({
            providerId: defaultProviderKey.toUpperCase(),
          })
        );
        return true;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, 'logout -> error', error);
        return false;
      }
    );
  }

  // ------------------------------------------------------------------------------

  public check(data?: any): Promise<any> {
    const provider = this.getDefaultProvider();
    if (provider) {
      return provider.check(data);
    }
    return Promise.reject('Current Provider Not Available!!!');
  }

  public login(loginData?: any): Promise<any> {
    const provider = this.getDefaultProvider();
    if (provider) {
      return provider.login(loginData);
    }
    return Promise.reject('Current Provider Not Available!!!');
  }

  public logout(logoutData?: any): Promise<boolean> {
    const provider = this.getDefaultProvider();
    if (provider) {
      return provider.logout({
        payload: this.getPayload(logoutData),
        token: this.getTokenData(logoutData),
        data: logoutData,
      });
    }
    return Promise.reject('Provider Not Allowed To Logout!!!');
  }

  public refreshToken(refreshTokenData?: any): Promise<boolean> {
    const provider = this.getDefaultProvider();
    if (provider) {
      return provider.refreshToken({
        payload: this.getPayload(refreshTokenData),
        token: this.getTokenData(refreshTokenData),
        data: refreshTokenData,
      });
    }
    return Promise.reject('Provider Not Allowed To Logout!!!');
  }

  // ------------------------------------------------------------------------------

  protected setPayload(payload?: any): void {
    this.dispatchPayload({
      data: payload,
    });
  }

  protected getPayload(data?: any): any {
    const payload = this.store.selectSnapshot<any>(AuthStoreState.getPayload);
    return payload ? payload : data;
  }

  protected getTokenData(data?: any): any {
    const tokenData = this.store.selectSnapshot<any>(AuthStoreState.getToken);
    return tokenData ? tokenData : data;
  }

  // ------------------------------------------------------------------------------

  public dispatchLoginAuthData(data?: any): void {
    this.dispatchAuthData(true, data, false);
  }

  public dispatchLogoutAuthData(data?: any): void {
    this.dispatchAuthData(false, data, false);
  }

  public dispatchRefreshTokenAuthData(data?: any): void {
    this.dispatchToken(
      data
        ? {
            tokenType: data?.tokenType,
            idToken: data?.idToken,
            accessToken: data?.accessToken,
            expiresIn: data?.expiresIn,
            expiresAt: data?.expiresAt,
            refreshToken: data?.refreshToken,
            tokenData: data?.tokenData,
          }
        : null
    );
  }

  // ------------------------------------------------------------------------------

  private dispatchAuthData(
    logged: boolean,
    payload?: any,
    loadedFromStore: boolean = false
  ): void {
    const provider = this.getDefaultProvider();

    /*
    this.dispatchProvider({
      providerId: provider ? provider.getProviderKey() : null,
    });
    */

    this.dispatchPayload(logged ? payload : null);

    let authFullData: AuthFullStoreModel | null = null;

    if (provider) {
      authFullData = provider.getAuthFullDataFromPayload(payload);
    }

    this.dispatchToken(
      logged
        ? {
            tokenType: authFullData?.token?.tokenType,
            idToken: authFullData?.token?.idToken,
            accessToken: authFullData?.token?.accessToken,
            expiresIn: authFullData?.token?.expiresIn,
            expiresAt: authFullData?.token?.expiresAt,
            refreshToken: authFullData?.token?.refreshToken,
            tokenData: authFullData?.token?.tokenData,
          }
        : null
    );

    this.dispatchUserData(
      logged
        ? {
            userName: authFullData?.userData?.userName,

            email: authFullData?.userData?.email,
            fullName: authFullData?.userData?.fullName,
            firstName: authFullData?.userData?.firstName,
            lastName: authFullData?.userData?.lastName,
            photoUrl: authFullData?.userData?.photoUrl,

            locale: authFullData?.userData?.locale,

            providerAuthId: authFullData?.userData?.providerAuthId,
          }
        : null
    );

    this.dispatchUserPermissions(
      logged
        ? {
            isLogged: authFullData?.userPermissions?.isLogged,
            isAnonymous: !logged,
            isAdmin: authFullData?.userPermissions?.isAdmin,
            userRoles: authFullData?.userPermissions?.userRoles,
          }
        : null
    );

    this.dispatchExtraData(logged ? authFullData?.extraData : null);

    // this.dispatchAuthenticationEndProcess(logged, loadedFromStore);
  }

  private dispatchPayload(payload: AuthPayloadModel | null): void {
    this.store.dispatch(new AuthChangePayloadStoreAction(payload));
  }

  private dispatchToken(token: AuthTokenModel | null): void {
    this.store.dispatch(new AuthChangeTokenStoreAction(token));
  }

  private dispatchUserData(userData: AuthUserStoreModel | null): void {
    this.store.dispatch(new AuthChangeUserDataStoreAction(userData));
  }

  private dispatchUserPermissions(
    userPermissions: AuthUserPermissionsModel | null
  ): void {
    this.store.dispatch(
      new AuthChangeUserPermissionsStoreAction(userPermissions)
    );
  }

  private dispatchExtraData(extraData: any | null): void {
    this.store.dispatch(new AuthChangeExtraDataStoreAction(extraData));
  }

  private dispatchAuthenticationEndProcess(
    logged: boolean,
    loadedFromStore: boolean
  ): Promise<boolean> {
    if (!loadedFromStore) {
      if (logged) {
        return firstValueFrom(
          this.store.dispatch(new AuthDoLoginSuccessfullyStoreAction(true))
        );
      }
      return firstValueFrom(
        this.store.dispatch(new AuthDoLogoutSuccessfullyStoreAction(true))
      );
    }
    return firstValueFrom(
      this.store.dispatch(
        new AuthChangeIsDataLoadedFromStorageStoreAction(logged)
      )
    );
  }

  // ------------------------------------------------------------------------------

  public dispatchLoginSuccessfully(): Promise<boolean> {
    return this.dispatchAuthenticationEndProcess(true, false);
  }

  public dispatchLogoutSuccessfully(): Promise<boolean> {
    return this.dispatchAuthenticationEndProcess(false, false);
  }

  public dispatchRefreshTokenSuccessfully(): Promise<boolean> {
    return this.dispatchAuthenticationEndProcess(true, false);
  }

  // ------------------------------------------------------------------------------

  public abstract hasPermissions(roles: string[], operator: string): boolean;

  // ------------------------------------------------------------------------------
}
