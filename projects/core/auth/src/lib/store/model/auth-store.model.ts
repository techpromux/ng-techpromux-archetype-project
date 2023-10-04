import { AuthPayloadModel } from '../../model/auth-payload.model';
import { AuthProviderModel } from '../../model/auth-provider.model';
import { AuthTokenModel } from '../../model/auth-token.model';
import { AuthUserStoreModel } from '../../model/auth-user-data.model';
import { AuthUserPermissionsModel } from '../../model/auth-user-permissions.model';

export interface AuthStoreModel {
  provider: AuthProviderModel | null;
  payload: AuthPayloadModel | null;
  token: AuthTokenModel | null;
  userData: AuthUserStoreModel | null;
  userPermissions: AuthUserPermissionsModel | null;

  extraData: unknown | null;

  loadedFromStore: boolean;
  loggedAt: string | null;
  logged: boolean;
}
