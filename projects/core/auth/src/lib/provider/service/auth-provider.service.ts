/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthManagerService } from '../../manager/service/auth-manager.service';
import { AuthFullStoreModel } from '../../model/auth-full-data.model';
import { AuthProviderTypeModel } from '../../model/auth-provider-type.model';

export interface AuthProviderService {
  setAuthManagerService(authManager: AuthManagerService): void;

  getProviderKey(): AuthProviderTypeModel | string;

  init(data: any): Promise<boolean>;

  isEnabled(): boolean;

  setIsDefault(
    isDefault: boolean,
    defaultAuthData: any | null
  ): Promise<boolean>;

  check(data?: any): Promise<boolean>;

  login(data?: any): Promise<boolean | undefined>;

  logout(data?: any): Promise<boolean>;

  refreshToken(data?: any): Promise<boolean>;

  getAuthFullDataFromPayload(payload?: any): AuthFullStoreModel;
}
