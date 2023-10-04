/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';

import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { UtilUuidService } from '@ng-techpromux-archetype-project/core-util';
import { filter, Observable, take } from 'rxjs';
import { LoaderIndicatorResetAllStoreAction } from '../action/loader-indicator-reset-all-store.action';
import { LoaderIndicatorStopForStoreAction } from '../action/loader-indicator-stop-for-store.action';
import { LoaderIndicatorWaitForStoreAction } from '../action/loader-indicator-wait-for-store.action';
import { LoaderIndicatorStoreModel } from '../model/loader-indicator-data.model';
import { CORE_LOADING_STATE_TOKEN } from '../variable/variables';

@State<LoaderIndicatorStoreModel>({
  name: CORE_LOADING_STATE_TOKEN,
  defaults: LoaderIndicatorStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class LoaderIndicatorStoreState extends AbstractStoreState {
  private uuid: UtilUuidService = inject<UtilUuidService>(
    UtilUuidService
  );

  private store: Store = inject<Store>(Store);

  private observables: Map<
    string,
    Observable<boolean | null> | Promise<boolean | null>
  > = new Map();

  // ----------------------------------------------------------

  static override getStoredDefaultsValue(): LoaderIndicatorStoreModel {
    return {
      loading: false,
      actives: {},
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'loading' + '.' + key
    );
  }

  // ----------------------------------------------------------

  @Selector()
  static isLoading(state: LoaderIndicatorStoreModel): boolean {
    return state.loading;
  }

  @Action(LoaderIndicatorWaitForStoreAction)
  waitFor(
    ctx: StateContext<LoaderIndicatorStoreModel>,
    action: LoaderIndicatorWaitForStoreAction
  ): void {
    const state = ctx.getState();
    if (action.obs) {
      const pid = this.uuid.uuid();
      const actives = { ...state.actives, [pid]: action.description };
      this.observables.set(pid, action.obs);
      ctx.patchState({
        loading: Object.keys(actives).length > 0,
        actives: actives,
      });
      if (action.obs instanceof Observable) {
        action.obs
          .pipe(
            filter((result) => result === false),
            take(1)
          )
          .subscribe((result: boolean | null) => {
            if (result === false) {
              setTimeout(() => {
                this.store.dispatch(
                  new LoaderIndicatorStopForStoreAction(pid)
                );
              }, 200);
            }
          });
      } else if (action.obs instanceof Promise) {
        action.obs.then((result: boolean | null) => {
          if (result === false) {
            setTimeout(() => {
              this.store.dispatch(new LoaderIndicatorStopForStoreAction(pid));
            }, 200);
          }
        });
      }
    }
  }

  @Action(LoaderIndicatorStopForStoreAction)
  stopFor(
    ctx: StateContext<LoaderIndicatorStoreModel>,
    action: LoaderIndicatorStopForStoreAction
  ): void {
    const state = ctx.getState();
    const actives = { ...state.actives };
    delete actives[action.pid];
    this.observables.delete(action.pid);
    ctx.patchState({
      loading: Object.keys(actives).length > 0,
      actives: actives,
    });
  }

  @Action(LoaderIndicatorResetAllStoreAction)
  resetAll(
    ctx: StateContext<LoaderIndicatorStoreModel>,
    action: LoaderIndicatorResetAllStoreAction
  ): void {
    const state = ctx.getState();
    const actives = {};
    this.observables.clear();
    ctx.patchState({
      loading: Object.keys(actives).length > 0,
      actives: actives,
    });
  }
}
