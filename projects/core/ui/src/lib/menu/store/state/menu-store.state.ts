/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Action, State, StateContext } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { MenuSetItemStoreAction } from '../action/menu-set-item-store.action';
import { MenuStoreModel } from '../model/menu-store.model';
import { MENU_STATE_TOKEN } from '../variable/variables';

@State<MenuStoreModel>({
  name: MENU_STATE_TOKEN,
  defaults: MenuStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class MenuStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): MenuStoreModel {
    return {
      items: {},
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'menu' + '.' + key
    );
  }

  // ----------------------------------------------------------

  static getMenuItemsSelector(id: string) {
    return (state: any) => state.menu.items[id];
  }

  // ----------------------------------------------------------

  @Action(MenuSetItemStoreAction)
  setItemAction(
    ctx: StateContext<MenuStoreModel>,
    action: MenuSetItemStoreAction
  ): void {
    const state = ctx.getState();
    if (action.id) {
      ctx.patchState({
        items: { ...state.items, [action.id]: action.options },
      });
    }
  }

  // ----------------------------------------------------------
}
