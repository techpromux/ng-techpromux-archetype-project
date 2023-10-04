import { StateToken } from '@ngxs/store';
import { LayoutStoreModel } from '../model/layout-data.model';

export const LAYOUT_STATE_TOKEN = new StateToken<LayoutStoreModel>('layout');
