import { StateToken } from '@ngxs/store';
import { FlowStoreModel } from '../model/flow-data.model';

export const FLOW_STATE_TOKEN = new StateToken<FlowStoreModel>('flow');
