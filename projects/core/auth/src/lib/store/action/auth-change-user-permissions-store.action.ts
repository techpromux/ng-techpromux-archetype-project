import { AuthUserPermissionsModel } from "../../model/auth-user-permissions.model";

export class AuthChangeUserPermissionsStoreAction {
  static readonly type = '[AUTH] Change User Permissions';

  constructor(public userPermissions: AuthUserPermissionsModel | null) {}
}
