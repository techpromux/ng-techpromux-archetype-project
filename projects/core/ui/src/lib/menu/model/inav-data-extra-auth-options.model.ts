/* eslint-disable @typescript-eslint/no-explicit-any */

export interface INavDataExtraAuthOptions {
  requiredRolesOperator?: string; // default true
  requiredRoles?: string[]; // default []
  checkAccessFn?: (options: any) => boolean;
}
