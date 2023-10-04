export class TranslationChangeDateFormatStoreAction {

  static readonly type = '[TRANSLATION] Change Date Format';

  constructor(public dateFormat: string) {
  }

};
