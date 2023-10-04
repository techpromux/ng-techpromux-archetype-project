import { AuthProviderModel } from "../../model/auth-provider.model";

export class AuthChangeProviderStoreAction {
  static readonly type = '[AUTH] Change Provider';

  constructor(public provider: AuthProviderModel | null) {}
}
