import { AuthUserStoreModel } from "../../model/auth-user-data.model";

export class AuthChangeUserDataStoreAction {
  static readonly type = '[AUTH] Change User Data';

  constructor(public userData: AuthUserStoreModel | null) {}
}
