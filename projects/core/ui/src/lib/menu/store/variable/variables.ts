import { StateToken } from '@ngxs/store';
import { MenuStoreModel } from '../model/menu-store.model';

export const MENU_STATE_TOKEN = new StateToken<MenuStoreModel>('menu');
