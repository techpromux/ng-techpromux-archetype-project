import { StateToken } from '@ngxs/store';
import { LoaderIndicatorStoreModel } from '../model/loader-indicator-data.model';

export const CORE_LOADING_STATE_TOKEN =
  new StateToken<LoaderIndicatorStoreModel>('loading');
