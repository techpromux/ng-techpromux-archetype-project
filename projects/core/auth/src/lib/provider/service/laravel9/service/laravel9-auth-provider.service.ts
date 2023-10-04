/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@ng-techpromux-archetype-project/core-service';
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
import { AUTH_PROVIDER_LARAVEL9_CONFIG_TOKEN } from '../variable/variables';

interface Laravel9AuthConfigModel {
  apiBasePath: string;
  apiTokenRefreshTime: number;
}

@Injectable()
export class Laravel9AuthProviderService extends AbstractAuthProviderService<Laravel9AuthConfigModel> {
  protected auth: AuthService = inject<AuthService>(AuthService);

  protected providerAuthConfig: {
    enabled: boolean;
    config: any;
  } = inject<{
    enabled: boolean;
    config: any;
  }>(AUTH_PROVIDER_LARAVEL9_CONFIG_TOKEN);

  constructor() {
    super();
  }

  public getProviderKey(): string {
    return AuthProviderTypeModel.LARAVEL9;
  }

  public isEnabled(): boolean {
    return this.providerAuthConfig.enabled;
  }

  protected doConfigure(callback?: (data?: any) => void): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doConfigure');

    this.setAuthConfig({
      apiBasePath: this.providerAuthConfig.config.base_path,
      apiTokenRefreshTime: Number.parseInt(
        this.providerAuthConfig.config.token_refresh_time
      ),
    });

    return Promise.resolve(true);
  }

  protected doCheck(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'doCheck', data);

    const params: any = {
      ...data,
    };

    const result$: Subject<boolean | any> = new Subject();

    this.auth
      .check(params as any)
      // .profile(params as any)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.logger.console.debug(
            this.__classname,
            'doCheck -> ok',
            response
          );
          result$.next(true);
          result$.complete();
        },
        (error: any) => {
          this.logger.console.debug(
            this.__classname,
            'doCheck -> error',
            error
          );
          result$.next(false);
          result$.complete();
        }
      );

    return firstValueFrom(result$.asObservable());
  }

  protected doLogin(data?: any): Promise<boolean | undefined> {
    this.logger.console.debug(this.__classname, 'doLogin');

    const bodyParams: any = {
      email: data.username,
      password: data.password,
      remember_me: data.remember_me,
    };

    const result$: Subject<boolean | any> = new Subject();

    this.auth
      .login(bodyParams as any)
      .pipe(
        take(1),
        // Obtain Token Response and Verify if is OK or NOT
        map((tokenResponse: any) => {
          this.logger.console.debug(
            this.__classname,
            'authentication -> response',
            tokenResponse
          );

          if (tokenResponse?.data?.tokens?.access_token) {
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

          this.auth.configuration.accessToken =
            tokenResponse?.data?.tokens?.access_token;

          const profileBodyParams: any = {
            user: tokenResponse.data.user.email,
          };

          return this.auth.profile(profileBodyParams).pipe(
            take(1),
            // Processing User Response Successfully
            map((userResponse: any) => {
              this.logger.console.debug(
                this.__classname,
                'userData -> obtained',
                userResponse
              );

              return {
                tokenResponse: tokenResponse.data,
                userResponse: userResponse ? userResponse : {},
              };
            })
          );
        }),
        // Processing Token Response and User Data Successfully
        map(({ tokenResponse, userResponse }: any) => {
          const userPayload = {
            tokens: tokenResponse.tokens,
            user: userResponse.data,
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
        (response: any) => {
          this.logger.console.debug(this.__classname, 'signIn -> ok', response);
          this.emitLoginCallback(response);
          result$.next(true);
          result$.complete();
        },
        (error: any) => {
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

    const bodyParams: any = {
      refresh_token: data?.token.refreshToken,
    };

    const result$: Subject<boolean | any> = new Subject();

    this.auth
      .refreshToken(bodyParams)
      .pipe(
        take(1),
        map((refreshTokenResponse: any) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenResponse',
            refreshTokenResponse
          );

          if (refreshTokenResponse?.data?.tokens) {
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

          this.auth.configuration.accessToken =
            refreshTokenResponse.data.tokens.access_token;

          const refreshTokenData = this.getTokenDataFromPayload(
            refreshTokenResponse.data
          );

          return refreshTokenData;
        })
      )
      .subscribe(
        (refreshTokenData: any) => {
          this.logger.console.debug(
            this.__classname,
            'refreshTokenData -> ok',
            refreshTokenData
          );
          this.emitRefreshTokenCallback(refreshTokenData);
          result$.next(true);
          result$.complete();
        },
        (error: any) => {
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
    return payload?.user?.email;
  }

  protected getUserRoles(payload: any): string[] {
    return Number.parseInt(payload?.user?.role_id) === 1
      ? ['ROLE_USER', 'ROLE_LARAVEL_USER', 'ROLE_ADMIN', 'ROLE_LARAVEL_ADMIN']
      : ['ROLE_USER', 'ROLE_LARAVEL_USER'];
  }

  protected getProviderAuthId(payload: any): string | null {
    return payload?.user?.email;
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
    return payload?.user?.email;
  }

  protected getFullName(payload: any): string | null {
    return payload?.user?.name;
  }

  protected getFirstName(payload: any): string | null {
    return payload?.user?.name;
  }

  protected getLastName(payload: any): string | null {
    return '';
  }

  protected getPhotoUrl(payload: any): string | null {
    return this.authConfig.apiBasePath + '/storage/' + payload?.user?.avatar;
  }

  protected getLocale(payload: any): string | null {
    return payload?.user?.settings?.locale;
  }

  protected doGetExtraData(payload?: any) {
    return payload?.user;
  }
}
