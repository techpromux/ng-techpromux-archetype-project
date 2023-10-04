export class TranslationChangeTextDirectionStoreAction {

  static readonly type = '[TRANSLATION] Change Text Direction';

  constructor(public textDirection: string) {
  }

};

