/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { OptionsListsLoadedOptionsStoreAction } from '../action/options-lists-loaded-options-store.action';
import { OptionsListsRequestingOptionsStoreAction } from '../action/options-lists-requesting-options-store.action';
import { OptionsListsSaveOptionsStoreAction } from '../action/options-lists-save-options-store.action';
import { OptionsListsStoreModel } from '../model/options-lists-data.model';
import { OPTIONS_LISTS_STATE_TOKEN } from '../variable/options-lists-data.state-token';

@State<OptionsListsStoreModel>({
  name: OPTIONS_LISTS_STATE_TOKEN,
  defaults: OptionsListsStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class OptionsListsStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): OptionsListsStoreModel {
    return {
      lists: {},
      loaded: {},
      requested: {},
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'options' + '.' + key
    );
  }

  // ----------------------------------------------------------

  @Selector()
  static getLoadedKeys(state: OptionsListsStoreModel): any {
    return state.loaded;
  }

  @Selector()
  static getRequestedKeys(state: OptionsListsStoreModel): any {
    return state.requested;
  }

  static getOptionsList(listKey: string) {
    return createSelector(
      [OptionsListsStoreState],
      (state: OptionsListsStoreModel) => {
        return state.lists[listKey];
      }
    );
  }

  // ----------------------------------------------------------

  @Action(OptionsListsSaveOptionsStoreAction)
  saveOptionsAction(
    ctx: StateContext<OptionsListsStoreModel>,
    action: OptionsListsSaveOptionsStoreAction
  ): void {
    const state = ctx.getState();
    const lists = state.lists;
    const newList: any = {};
    const fullKeyPath = action.lang + '__' + action.key;
    newList[fullKeyPath] = action.options;
    ctx.patchState({
      lists: Object.assign({}, lists, newList),
    });

    ctx.dispatch(new OptionsListsLoadedOptionsStoreAction(fullKeyPath));
  }

  // ----------------------------------------------------------

  @Action(OptionsListsLoadedOptionsStoreAction)
  setLoadedOptionsAction(
    ctx: StateContext<OptionsListsStoreModel>,
    action: OptionsListsLoadedOptionsStoreAction
  ): void {
    const state = ctx.getState();

    const loaded = state.loaded;
    const newLoaded: any = {};
    newLoaded[action.key] = true;
    ctx.patchState({
      loaded: Object.assign({}, loaded, newLoaded),
    });
  }

  // ----------------------------------------------------------

  @Action(OptionsListsRequestingOptionsStoreAction)
  setRequestingOptionsAction(
    ctx: StateContext<OptionsListsStoreModel>,
    action: OptionsListsRequestingOptionsStoreAction
  ): void {
    const state = ctx.getState();
    const requested = state.requested;
    const newRequested: any = { ...requested };
    newRequested[action.key] = true;
    ctx.patchState({
      requested: { ...newRequested },
    });
  }

  // ----------------------------------------------------------
}
