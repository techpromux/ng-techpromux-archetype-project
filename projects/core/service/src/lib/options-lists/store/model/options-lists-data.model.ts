import { OptionItemModel } from '../../model/option-item.model';

export interface OptionsListsStoreModel {
  lists: {
    [id: string]: OptionItemModel[];
  };
  loaded: {
    [id: string]: boolean;
  };
  requested: {
    [id: string]: boolean;
  };
}
