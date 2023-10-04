import { AuthTokenModel } from './auth-token.model';
import { AuthUserStoreModel } from './auth-user-data.model';
import { AuthUserPermissionsModel } from './auth-user-permissions.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthFullStoreModel {
  payload: any | null;
  token: AuthTokenModel | null;
  userData: AuthUserStoreModel | null;
  userPermissions: AuthUserPermissionsModel | null;
  extraData: any | null;
}
