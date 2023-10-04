import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';
import { Observable } from 'rxjs';
import { LoaderIndicatorResetAllStoreAction } from '../store/action/loader-indicator-reset-all-store.action';
import { LoaderIndicatorWaitForStoreAction } from '../store/action/loader-indicator-wait-for-store.action';

@Injectable()
export class LoaderIndicatorService {
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------
  protected readonly __classname: string;

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  protected store: Store = inject<Store>(Store);

  protected readonly logger: LoggerService =
    inject<LoggerService>(LoggerService);

  // ----------------------------------------------------------
  constructor() {
    this.__classname = this.constructor.name;
  }

  public waitFor(
    observable: Observable<boolean | null> | null | Promise<boolean | null>,
    description: string
  ): void {
    if (observable) {
      this.store.dispatch(
        new LoaderIndicatorWaitForStoreAction(observable, description)
      );
    }
  }

  public restAll(): void {
    this.store.dispatch(new LoaderIndicatorResetAllStoreAction());
  }
}
