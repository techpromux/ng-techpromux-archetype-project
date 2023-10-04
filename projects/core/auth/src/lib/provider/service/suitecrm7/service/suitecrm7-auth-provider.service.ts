/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ModuleService } from '@ng-techpromux-archetype-project/core-service';
import {
  firstValueFrom,
  map,
  Subject,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthProviderTypeModel } from '../../../../model/auth-provider-type.model';
import { AbstractAuthProviderService } from '../../abstract-auth-provider.service';
import { AUTH_PROVIDER_SUITECRM7_CONFIG_TOKEN } from '../variable/variables';

interface SuiteCrm7AuthConfigModel {
  apiBasePath: string;
  apiClientId: string;
  apiClientSecret: string;
  apiUserModuleName: string;
  apiLoginPath: string;
  apiLogoutPath: string;
  apiRefreshTokenPath: string;
  apiTokenRefreshTime: number;
}

@Injectable()
export class SuiteCrm7AuthProviderService extends AbstractAuthProviderService<SuiteCrm7AuthConfigModel> {
  protected moduleService: ModuleService = inject<ModuleService>(ModuleService);

  protected http: HttpClient = inject<HttpClient>(HttpClient);

  protected providerAuthConfig: {
    enabled: boolean;
    config: any;
  } = inject<{
    enabled: boolean;
    config: any;
  }>(AUTH_PROVIDER_SUITECRM7_CONFIG_TOKEN);

  constructor() {
    super();
  }

  public getProviderKey(): string {
    return AuthProviderTypeModel.SUITECRM7;
  }

  public isEnabled(): boolean {
    return this.providerAuthConfig.enabled;
  }

  protected doConfigure(callback?: (data?: any) => void): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doConfigure');

    this.setAuthConfig({
      apiBasePath: this.providerAuthConfig.config.base_path,
      apiClientId: this.providerAuthConfig.config.client_id,
      apiClientSecret: this.providerAuthConfig.config.client_secret,
      apiUserModuleName: this.providerAuthConfig.config.user_module_name,
      apiLoginPath: this.providerAuthConfig.config.base_path?.replace(
        '/Api/V8',
        '/Api/access_token'
      ),
      apiLogoutPath: this.providerAuthConfig.config.base_path?.replace(
        '/Api/V8',
        '/Api/logout'
      ),
      apiRefreshTokenPath: this.providerAuthConfig.config.base_path?.replace(
        '/Api/V8',
        '/Api/access_token'
      ),
      apiTokenRefreshTime: Number.parseInt(
        this.providerAuthConfig.config.token_refresh_time
      ),
    });

    return Promise.resolve(true);
  }

  protected doCheck(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doCheck');
    return Promise.resolve(true);
  }

  protected doLogin(data?: any): Promise<boolean | undefined> {
    this.logger.console.debug(this.__classname, 'doLogin');

    const params: any = {
      grant_type: 'password',
      client_id: this.authConfig.apiClientId,
      client_secret: this.authConfig.apiClientSecret,
      username: data.username,
      password: data.password,
      scope: '',
    };

    const bodyParams = new URLSearchParams();
    Object.keys(params).forEach((k: string) => {
      bodyParams.set(k, params[k]);
    });

    const httpOptions = {
      headers: new HttpHeaders()
        //.set('Content-Type', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    const result$: Subject<boolean | any> = new Subject();

    this.http
      .post(this.authConfig.apiLoginPath, bodyParams.toString(), httpOptions)
      .pipe(
        take(1),
        // Obtain Token Response and Verify if is OK or NOT
        map((tokenResponse: any) => {
          this.logger.console.debug(
            this.__classname,
            'authentication -> response',
            tokenResponse
          );

          if (tokenResponse?.access_token) {
            return tokenResponse;
          }

          this.logger.console.debug(
            this.__classname,
            'authentication -> error'
          );

          const error = JSON.stringify(
            tokenResponse?.error ? tokenResponse?.error : tokenResponse
          );

          this.logger.console.error(this.__classname, error);

          return throwError(() => new Error(error));
        }),
        // Processing Token Response Successfully and Request User Data
        switchMap((tokenResponse: any) => {
          this.logger.console.debug(this.__classname, 'authentication -> ok');

          this.moduleService.configuration.accessToken =
            tokenResponse.access_token;

          return (
            this.moduleService
              .moduleModuleGet(
                this.authConfig.apiUserModuleName,
                undefined,
                1,
                1,
                undefined,
                'and',
                { 'filter[user_name][eq]': params.username }
              )
              /*
          this.http
            .get(
              this.authConfig.apiBasePath +
                '/module/' +
                this.authConfig.apiUserModuleName +
                '?filter[operator]=and' +
                '&filter[user_name][eq]=' +
                params.username,
              {
                headers: {
                  Authorization: 'Bearer ' + tokenResponse.access_token,
                },
              }
            )*/
              .pipe(
                take(1),
                // Processing User Response Successfully
                map((userResponse: any) => {
                  this.logger.console.debug(
                    this.__classname,
                    'userData -> obtained',
                    userResponse
                  );

                  return {
                    tokenResponse,
                    userResponse: userResponse?.data[0]
                      ? userResponse.data[0]
                      : {},
                  };
                })
              )
          );
        }),
        // Processing Token Response and User Data Successfully
        map(({ tokenResponse, userResponse }: any) => {
          const userPayload = {
            tokens: tokenResponse,
            user: userResponse,
          };
          this.logger.console.debug(
            this.__classname,
            'emitLoginCallback -> userPayload',
            userPayload
          );

          // obtain groups???

          return userPayload;
        })
      )
      .subscribe(
        (response) => {
          this.logger.console.debug(this.__classname, 'signIn -> ok', response);
          this.emitLoginCallback(response);
          result$.next(true);
          result$.complete();
        },
        (error) => {
          this.logger.console.debug(this.__classname, 'signIn -> error', error);
          result$.next(false);
          result$.complete();
        }
      );

    return firstValueFrom(result$.asObservable());
  }

  protected doLogout(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'logout');
    this.emitLogoutCallback(null);
    return Promise.resolve(true);
  }

  protected doRefreshToken(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doRefreshToken', data);

    const params: any = {
      grant_type: 'refresh_token',
      client_id: this.authConfig.apiClientId,
      client_secret: this.authConfig.apiClientSecret,
      refresh_token: data?.token.refreshToken,
    };

    const bodyParams = new URLSearchParams();
    Object.keys(params).forEach((k: string) => {
      bodyParams.set(k, params[k]);
    });

    const httpOptions = {
      headers: new HttpHeaders()
        //.set('Content-Type', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    const result$: Subject<boolean | any> = new Subject();

    this.http
      .post(
        this.authConfig.apiRefreshTokenPath,
        bodyParams.toString(),
        httpOptions
      )
      .pipe(
        take(1),
        map((refreshTokenResponse: any) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenResponse',
            refreshTokenResponse
          );

          if (refreshTokenResponse?.access_token) {
            return refreshTokenResponse;
          }

          this.logger.console.debug(this.__classname, 'refreshToken -> error');

          const error = JSON.stringify(
            refreshTokenResponse?.message
              ? refreshTokenResponse?.message
              : refreshTokenResponse
          );

          this.logger.console.error(this.__classname, error);

          return throwError(() => new Error(error));
        }),
        map((refreshTokenResponse: any) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenResponse -> ok',
            refreshTokenResponse
          );

          this.moduleService.configuration.accessToken =
            refreshTokenResponse.access_token;

          const refreshTokenData = this.getTokenDataFromPayload(
            refreshTokenResponse.data
          );

          return refreshTokenData;
        })
      )
      .subscribe(
        (refreshTokenData) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenData -> ok',
            refreshTokenData
          );
          this.emitRefreshTokenCallback(refreshTokenData);
          result$.next(true);
          result$.complete();
        },
        (error) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenData -> error',
            error
          );
          result$.next(false);
          result$.complete();
        }
      );

    return firstValueFrom(result$.asObservable());
  }

  protected isLogged(payload?: any): boolean {
    return !!payload?.tokens?.access_token;
  }

  protected getTokenType(payload: any): string | null {
    return payload?.tokens?.token_type;
  }

  protected getTokenExpiresIn(payload: any): number | null {
    return payload?.tokens?.expires_in;
  }

  protected getTokenExpiresAt(payload: any): Date | null {
    const expiresAt = new Date(
      new Date().getTime() + Number.parseInt(payload?.tokens?.expires_in)
    );
    return expiresAt;
  }

  protected getUserName(payload: any): string | null {
    return payload?.user?.attributes?.user_name;
  }

  protected getUserRoles(payload: any): string[] {
    return Number.parseInt(payload?.user?.attributes?.is_admin) === 1
      ? ['ROLE_USER', 'ROLE_SUITECRM_USER', 'ROLE_ADMIN', 'ROLE_SUITECRM_ADMIN']
      : ['ROLE_USER', 'ROLE_SUITECRM_USER'];
  }

  protected getProviderAuthId(payload: any): string | null {
    return payload?.user?.attributes?.id;
  }

  protected getToken(payload: any): string | null {
    return payload?.tokens?.access_token;
  }

  protected getTokenId(payload: any): string | null {
    const decodedTokenData = this.getTokenDecodedData(payload);
    return decodedTokenData?.aud;
  }

  protected getTokenAccessToken(payload: any): string | null {
    return payload?.tokens?.access_token;
  }

  protected getTokenRefreshToken(payload: any): string | null {
    return payload?.tokens?.refresh_token;
  }

  protected getEmail(payload: any): string | null {
    return payload?.user?.attributes?.email1;
  }

  protected getFullName(payload: any): string | null {
    return payload?.user?.attributes?.full_name;
  }

  protected getFirstName(payload: any): string | null {
    return payload?.user?.attributes?.first_name;
  }

  protected getLastName(payload: any): string | null {
    return payload?.user?.attributes?.last_name;
  }

  protected getPhotoUrl(payload: any): string | null {
    return (
      // this.authConfig.apiBasePath.replace('/Api/V8', '/upload/') +
      this.authConfig.apiBasePath.replace(
        '/Api/V8',
        '/index.php?entryPoint=download&type=Users&id='
      ) +
      payload?.user?.id +
      '_photo'
    );
  }

  protected getLocale(payload: any): string | null {
    return 'en';
  }

  protected doGetExtraData(payload?: any) {
    return payload?.user;
  }
}
