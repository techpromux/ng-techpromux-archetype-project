import { Observable } from 'rxjs';

export class LoaderIndicatorWaitForStoreAction {
  static readonly type = '[LOADING] Init';

  constructor(
    public obs: Observable<boolean | null> | Promise<boolean | null>,
    public description: string = ''
  ) {}
}
