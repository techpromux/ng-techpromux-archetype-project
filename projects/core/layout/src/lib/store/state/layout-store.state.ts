/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { LayoutSidebarUnfoldableToggleStoreAction } from '../action/layout-sidebar-unfoldable-toggle-store.action';
import { LayoutSidebarVisibleToggleStoreAction } from '../action/layout-sidebar-visible-toggle-store.action';
import { LayoutStoreModel } from '../model/layout-data.model';
import { LAYOUT_STATE_TOKEN } from '../variable/variables';

@State<LayoutStoreModel>({
  name: LAYOUT_STATE_TOKEN,
  defaults: LayoutStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class LayoutStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): LayoutStoreModel {
    return {
      sidebar: {
        visible_toggled: false,
        unfoldable_toggled: false,
      },
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return ['sidebar'].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'layout' + '.' + key
    );
  }

  // ----------------------------------------------------------

  @Selector()
  static isSidebarVisibleToggled(state: LayoutStoreModel): boolean {
    return state.sidebar.visible_toggled;
  }

  @Selector()
  static isSidebarUnfoldableToggled(state: LayoutStoreModel): boolean {
    return state.sidebar.unfoldable_toggled;
  }
  // ----------------------------------------------------------

  @Action(LayoutSidebarUnfoldableToggleStoreAction)
  sidebarUnfoldableToggleAction(
    ctx: StateContext<LayoutStoreModel>,
    action: LayoutSidebarUnfoldableToggleStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      sidebar: { ...state.sidebar, unfoldable_toggled: action.toggle },
    });
  }

  @Action(LayoutSidebarVisibleToggleStoreAction)
  sidebarVisibleToggleAction(
    ctx: StateContext<LayoutStoreModel>,
    action: LayoutSidebarVisibleToggleStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      sidebar: { ...state.sidebar, visible_toggled: action.toggle },
    });
  }
  // ----------------------------------------------------------
}
