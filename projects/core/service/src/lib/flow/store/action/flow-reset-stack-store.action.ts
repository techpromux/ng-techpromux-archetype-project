export class FlowResetStackStoreAction {
  static readonly type = '[FLOW] Reset Stack';

  constructor(public reset: boolean) {}
}
