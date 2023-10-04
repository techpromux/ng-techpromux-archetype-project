import { AuthPayloadModel } from "../../model/auth-payload.model";

export class AuthChangePayloadStoreAction {
  static readonly type = '[AUTH] Change Payload';

  constructor(public payload: AuthPayloadModel | null) {}
}
