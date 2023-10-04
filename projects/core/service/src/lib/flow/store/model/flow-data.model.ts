import { FlowActionModel } from '../../model/flow-action.model';
import { FlowStatusModel } from './flow-status.model';

export interface FlowStoreModel {
  stack: FlowActionModel[];

  status: FlowStatusModel | null;
}
