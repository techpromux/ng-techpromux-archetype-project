import { FlowActionModel } from '../../model/flow-action.model';

export class FlowStackFlowActionStoreAction {
  static readonly type = '[FLOW] Stack Flow Action';

  constructor(public flowAction: FlowActionModel) {}
}
