export class AuthChangeIsDataLoadedFromStorageStoreAction {
  static readonly type = '[AUTH] Is Data Loaded From Storage';

  constructor(public loadedFromStorage: boolean) {}
}
