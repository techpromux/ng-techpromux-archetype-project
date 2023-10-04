import { OptionItemModel } from '../../model/option-item.model';

export class OptionsListsSaveOptionsStoreAction {
  static readonly type = '[OPTIONS] Save Options List';

  constructor(
    public key: string,
    public options: OptionItemModel[],
    public lang: string
  ) {}
}
