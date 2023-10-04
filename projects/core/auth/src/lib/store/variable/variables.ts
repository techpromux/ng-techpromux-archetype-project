import { StateToken } from '@ngxs/store';
import { AuthStoreModel } from '../model/auth-store.model';

export const AUTH_STATE_TOKEN = new StateToken<AuthStoreModel>('auth');
