/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { AuthManagerService } from '../../manager/service/auth-manager.service';
import { AuthFullStoreModel } from '../../model/auth-full-data.model';
import { AuthProviderTypeModel } from '../../model/auth-provider-type.model';
import { AuthTokenModel } from '../../model/auth-token.model';
import { AuthUserStoreModel } from '../../model/auth-user-data.model';
import { AuthUserPermissionsModel } from '../../model/auth-user-permissions.model';
import { AuthProviderService } from './auth-provider.service';

export abstract class AbstractAuthProviderService<T>
  extends AbstractService
  implements AuthProviderService
{
  private readonly key: AuthProviderTypeModel | string = this.getProviderKey();

  private isDefault = false;

  protected authManager!: AuthManagerService;

  protected authConfig!: T;

  // -------------------------------------------------------

  protected constructor() {
    super();
  }

  // -------------------------------------------------------

  public setAuthManagerService(authManager: AuthManagerService): void {
    this.logger.console.debug(
      this.__classname,
      'setAuthManagerService',
      authManager
    );
    this.authManager = authManager;
  }

  protected setAuthConfig(config: T): void {
    this.logger.console.debug(this.__classname, 'setAuthConfig', config);
    this.authConfig = config;
  }

  // -------------------------------------------------------

  public abstract getProviderKey(): AuthProviderTypeModel | string;

  // -------------------------------------------------------

  public init(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'init', data);
    return this.configure(data).then((configured: boolean) => {
      return configured;
    });
  }

  public abstract isEnabled(): boolean;

  protected configure(callback?: (data?: any) => void): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'configure', callback);
    return this.doConfigure(callback);
  }

  protected abstract doConfigure(
    callback?: (data?: any) => void
  ): Promise<boolean>;

  public setIsDefault(
    isDefault: boolean,
    defaultAuthData: any | null = null
  ): Promise<boolean> {
    this.logger.console.debug(
      this.__classname,
      'setIsDefault',
      isDefault,
      defaultAuthData
    );
    this.isDefault = isDefault;
    if (this.isDefault) {
      return this.init(defaultAuthData);
    }
    return Promise.resolve(true);
  }

  // -------------------------------------------------------

  protected emitLoginCallback(data?: any): void {
    this.logger.console.debug(this.__classname, 'emitLoginCallback', data);
    this.logger.console.debug(
      this.__classname,
      'emitLoginCallback -> isDefault',
      this.isDefault
    );
    if (this.isDefault) {
      this.authManager.dispatchLoginAuthData(data);
    }
  }

  protected emitLogoutCallback(data?: any): void {
    this.logger.console.debug(this.__classname, 'emitLogoutCallback', data);
    this.logger.console.debug(
      this.__classname,
      'emitLogoutCallback -> isDefault',
      this.isDefault
    );
    if (this.isDefault) {
      this.authManager.dispatchLogoutAuthData(data);
    }
  }

  protected emitRefreshTokenCallback(data?: any): void {
    this.logger.console.debug(
      this.__classname,
      'emitRefreshTokenCallback',
      data
    );
    this.logger.console.debug(
      this.__classname,
      'emitRefreshTokenCallback -> isDefault',
      this.isDefault
    );
    if (this.isDefault) {
      this.authManager.dispatchRefreshTokenAuthData(data);
    }
  }

  // -------------------------------------------------------

  public check(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'check', data);
    if (!this.isDefault) {
      return Promise.reject('Provider Not Allowed To Login!!!');
    }
    return this.doCheck(data);
  }

  protected abstract doCheck(data?: any): Promise<boolean>;

  public login(data?: any): Promise<boolean | undefined> {
    this.logger.console.debug(this.__classname, 'login', data);
    if (!this.isDefault) {
      return Promise.reject('Provider Not Allowed To Login!!!');
    }
    return this.doLogin(data);
  }

  protected abstract doLogin(data?: any): Promise<boolean | undefined>;

  public logout(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'logout', data);
    this.doLogout(data).then(
      (result: boolean) => {
        this.logger.console.debug(
          this.__classname,
          'logout -> successfully',
          result
        );
      },
      (error: any) => {
        this.logger.console.error(this.__classname, 'logout -> error', error);
      }
    );
    return Promise.resolve(true);
  }

  protected abstract doLogout(data?: any): Promise<boolean>;

  public refreshToken(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'refreshToken', data);
    this.doRefreshToken(data).then(
      (result: boolean) => {
        this.logger.console.debug(
          this.__classname,
          'refreshToken -> successfully',
          result
        );
      },
      (error: any) => {
        this.logger.console.error(
          this.__classname,
          'refreshToken -> error',
          error
        );
      }
    );
    return Promise.resolve(true);
  }

  protected abstract doRefreshToken(data?: any): Promise<boolean>;

  // -------------------------------------------------------

  public getTokenDecodedData(payload?: any): any {
    this.logger.console.debug(this.__classname, 'getTokenDecodedData', payload);
    const token = this.getToken(payload);
    this.logger.console.debug(
      this.__classname,
      'getTokenDecodedData -> token',
      token
    );
    if (!token) {
      return null;
    }
    try {
      const tokenInfo = token.indexOf('.') !== -1 ? token.split('.')[1] : token;
      this.logger.console.debug(
        this.__classname,
        'getTokenDecodedData -> tokenInfo',
        tokenInfo
      );
      const tokenInfoDecoded = atob(tokenInfo); // from base64
      this.logger.console.debug(
        this.__classname,
        'getTokenDecodedData -> tokenInfoDecoded',
        tokenInfoDecoded
      );
      const tokenInfoDecodedJson = JSON.parse(tokenInfoDecoded);
      this.logger.console.debug(
        this.__classname,
        'getTokenDecodedData -> tokenInfoDecodedJson',
        tokenInfoDecodedJson
      );
      return tokenInfoDecodedJson;
    } catch (error) {
      this.logger.console.error(this.__classname, error);
    }
    return null;
  }

  // -------------------------------------------------------

  public getExtraData(payload?: any): any {
    return this.doGetExtraData(payload);
  }

  protected abstract doGetExtraData(payload?: any): any;

  // -------------------------------------------------------

  public getAuthFullDataFromPayload(payload?: any): AuthFullStoreModel {
    return {
      payload: payload,
      token: this.getTokenDataFromPayload(payload),
      userData: this.getUserDataFromPayload(payload),
      userPermissions: this.getUserPermissionsDataFromPayload(payload),
      extraData: this.getExtraData(payload),
    };
  }

  protected getTokenDataFromPayload(payload?: any): AuthTokenModel {
    return {
      tokenType: this.getTokenType(payload),

      idToken: this.getTokenId(payload),
      accessToken: this.getTokenAccessToken(payload),

      expiresIn: this.getTokenExpiresIn(payload),
      expiresAt: this.getTokenExpiresAt(payload),

      refreshToken: this.getTokenRefreshToken(payload),

      tokenData: this.getTokenDecodedData(payload),
    };
  }

  protected getUserDataFromPayload(payload?: any): AuthUserStoreModel {
    return {
      email: this.getEmail(payload),
      fullName: this.getFullName(payload),
      firstName: this.getFirstName(payload),
      lastName: this.getLastName(payload),
      userName: this.getUserName(payload),
      photoUrl: this.getPhotoUrl(payload),
      providerAuthId: this.getProviderAuthId(payload),
      locale: this.getLocale(payload),
    };
  }

  protected getUserPermissionsDataFromPayload(
    payload?: any
  ): AuthUserPermissionsModel {
    return {
      isAdmin: this.isAdmin(payload),
      isAnonymous: !this.isLogged(payload),
      isLogged: this.isLogged(payload),
      userRoles: this.getUserRoles(payload),
    };
  }

  protected abstract isLogged(payload?: any): boolean;

  protected abstract getTokenExpiresIn(payload: any): number | null;

  protected abstract getTokenExpiresAt(payload: any): Date | null;

  protected abstract getUserName(payload: any): string | null;

  protected abstract getUserRoles(payload: any): string[];

  protected abstract getProviderAuthId(payload: any): string | null;

  protected abstract getToken(payload: any): string | null;

  protected abstract getTokenType(payload: any): string | null;

  protected abstract getTokenId(payload: any): string | null;

  protected abstract getTokenAccessToken(payload: any): string | null;

  protected abstract getTokenRefreshToken(payload: any): string | null;

  protected abstract getEmail(payload: any): string | null;

  protected abstract getFullName(payload: any): string | null;

  protected abstract getFirstName(payload: any): string | null;

  protected abstract getLastName(payload: any): string | null;

  protected abstract getPhotoUrl(payload: any): string | null;

  protected abstract getLocale(payload: any): string | null;

  protected isAdmin(payload: any): boolean {
    return this.hasRole(payload, 'ROLE_ADMIN');
  }

  protected hasRole(payload: any, role: string): boolean {
    const userRoles = this.getUserRoles(payload);
    if (!userRoles) {
      return false;
    }
    return userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
  }

  protected hasRoles(payload: any, roles: string[], allRoles = true): boolean {
    const userRoles = this.getUserRoles(payload);
    if (!userRoles) {
      return false;
    }
    let hasAllRoles = allRoles;
    roles.forEach((role) => {
      if (allRoles) {
        hasAllRoles =
          hasAllRoles && userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      } else {
        hasAllRoles =
          hasAllRoles || userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      }
    });
    return hasAllRoles;
  }
}
