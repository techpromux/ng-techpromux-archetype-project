export class TranslationChangeCurrentLangStoreAction {
  static readonly type = '[TRANSLATION] Change Current Lang';

  constructor(public lang: string) {}
}
