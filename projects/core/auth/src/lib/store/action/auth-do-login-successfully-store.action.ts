export class AuthDoLoginSuccessfullyStoreAction {
  static readonly type = '[AUTH] Login Successfully';

  constructor(public loggedIn: boolean) {}
}
