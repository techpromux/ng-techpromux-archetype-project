import { AuthTokenModel } from "../../model/auth-token.model";

export class AuthChangeTokenStoreAction {
  static readonly type = '[AUTH] Change Token';

  constructor(public token: AuthTokenModel | null) {}
}
