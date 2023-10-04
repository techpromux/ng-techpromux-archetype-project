/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthManagerService {
  // -------------------------------------------------

  init(data?: any): Promise<boolean>;

  // -------------------------------------------------

  isProviderEnabled(providerKey: string): boolean;

  configureAsDefault(
    defaultProviderKey: string | null,
    defaultAuthData?: any | null
  ): Promise<boolean>;

  // -------------------------------------------------

  check(data?: any): Promise<any>;

  // -------------------------------------------------

  login(loginData?: any): Promise<any>;

  dispatchLoginAuthData(data?: any): void;

  dispatchLoginSuccessfully(): Promise<boolean>;

  // -------------------------------------------------

  logout(logoutData?: any): Promise<boolean>;

  dispatchLogoutAuthData(data?: any): void;

  dispatchLogoutSuccessfully(): Promise<boolean>;

  // -------------------------------------------------

  refreshToken(refreshTokenData?: any): Promise<boolean>;

  dispatchRefreshTokenAuthData(data?: any): void;

  dispatchRefreshTokenSuccessfully(): Promise<boolean>;

  // -------------------------------------------------------

  hasPermissions(roles: string[], operator: string): boolean;

  // -------------------------------------------------------
}
