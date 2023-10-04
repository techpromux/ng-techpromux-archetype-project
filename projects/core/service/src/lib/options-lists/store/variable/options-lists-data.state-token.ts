import { StateToken } from '@ngxs/store';
import { OptionsListsStoreModel } from '../model/options-lists-data.model';

export const OPTIONS_LISTS_STATE_TOKEN = new StateToken<OptionsListsStoreModel>(
  'options'
);
