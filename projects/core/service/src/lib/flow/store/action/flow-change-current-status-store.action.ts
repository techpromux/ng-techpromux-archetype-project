import { FlowStatusModel } from '../model/flow-status.model';

export class FlowChangeCurrentStatusStoreAction {
  static readonly type = '[FLOW] Change Current Status';

  constructor(public status: FlowStatusModel) {}
}
