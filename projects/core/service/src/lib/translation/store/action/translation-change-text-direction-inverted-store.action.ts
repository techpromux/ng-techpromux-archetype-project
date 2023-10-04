export class TranslationChangeTextDirectionInvertedStoreAction {

  static readonly type = '[TRANSLATION] Change Text Direction Inverted';

  constructor(public textDirectionInverted: boolean) {
  }

};
