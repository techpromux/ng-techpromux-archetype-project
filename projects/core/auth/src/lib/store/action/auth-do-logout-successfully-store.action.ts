export class AuthDoLogoutSuccessfullyStoreAction {
  static readonly type = '[AUTH] Logout Successfully';

  constructor(public loggedOut: boolean) {}
}
