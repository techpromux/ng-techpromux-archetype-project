export class FlowRemoveLastFlowStepInLastActionStoreAction {
  static readonly type = '[FLOW] Remove Last Flow Step in Last Action';

  constructor(public remove: boolean) {}
}
