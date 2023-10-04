export interface AuthUserPermissionsModel {
  isLogged: boolean | undefined;
  isAnonymous: boolean | undefined;
  isAdmin: boolean | undefined;
  userRoles: string[] | undefined;
}
