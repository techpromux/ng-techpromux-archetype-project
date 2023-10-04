import { FlowStepModel } from '../../model/flow-step.model';

export class FlowStackFlowStepInLastActionStoreAction {
  static readonly type = '[FLOW] Stack Flow Step in Last Action';

  constructor(public flowStep: FlowStepModel) {}
}
