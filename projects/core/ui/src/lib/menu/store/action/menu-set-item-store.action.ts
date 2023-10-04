/* eslint-disable @typescript-eslint/no-explicit-any */

export class MenuSetItemStoreAction {
  static readonly type = '[MENU] Set Item';

  constructor(public id: string, public options: any) {}
}
