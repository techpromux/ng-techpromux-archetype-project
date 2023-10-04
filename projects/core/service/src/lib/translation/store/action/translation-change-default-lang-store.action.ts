export class TranslationChangeDefaultLangStoreAction {

  static readonly type = '[TRANSLATION] Change Default Lang';

  constructor(public lang: string) {
  }

};
