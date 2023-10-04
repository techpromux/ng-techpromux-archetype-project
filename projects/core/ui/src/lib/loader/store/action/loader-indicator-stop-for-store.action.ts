export class LoaderIndicatorStopForStoreAction {
  static readonly type = '[LOADING] Stop';

  constructor(public pid: string) {}
}
