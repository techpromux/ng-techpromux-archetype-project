/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { FlowActionModel } from '../../model/flow-action.model';
import { FlowChangeCurrentStatusStoreAction } from '../action/flow-change-current-status-store.action';
import { FlowRemoveLastActionFromStackStoreAction } from '../action/flow-remove-last-action-from-stack-store.action';
import { FlowRemoveLastFlowStepInLastActionStoreAction } from '../action/flow-remove-last-flow-step-in-last-action-store.action';
import { FlowResetStackStoreAction } from '../action/flow-reset-stack-store.action';
import { FlowStackFlowActionStoreAction } from '../action/flow-stack-flow-action-store.action';
import { FlowStackFlowStepInLastActionStoreAction } from '../action/flow-stack-flow-step-in-last-action-store.action';
import { FlowStoreModel } from '../model/flow-data.model';
import { FlowStatusModel } from '../model/flow-status.model';
import { FLOW_STATE_TOKEN } from '../variable/variables';

@State<FlowStoreModel>({
  name: FLOW_STATE_TOKEN,
  defaults: FlowStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class FlowStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): FlowStoreModel {
    return {
      status: null,
      stack: [],
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return ['status', 'stack'].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'flow' + '.' + key
    );
  }

  // ----------------------------------------------------------

  @Selector()
  static getStatus(state: FlowStoreModel): FlowStatusModel | null {
    return state.status;
  }

  @Selector()
  static getCurrentFlowAction(state: FlowStoreModel): FlowActionModel | null {
    return state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
  }

  @Selector()
  static getPreviousFlowAction(state: FlowStoreModel): FlowActionModel | null {
    return state.stack.length > 1 ? state.stack[state.stack.length - 2] : null;
  }

  // ----------------------------------------------------------

  @Action(FlowChangeCurrentStatusStoreAction)
  changeCurrentStatus(
    ctx: StateContext<FlowStoreModel>,
    action: FlowChangeCurrentStatusStoreAction
  ): void {
    const state = ctx.getState();
    const stack = state.stack;
    const date = new Date();
    const flowStatus = Object.assign<any, FlowStatusModel, any>(
      {},
      action.status,
      {
        flowActionProcessedAt: date.getTime(),
        flowActionQueuePosition: stack.length,

        flowActionCanClose: stack.length !== 0,
        flowActionCanGoHome: stack.length !== 0,
        flowActionCanBackward:
          action.status.flowActionCanBackward !== false &&
          stack.length !== 0 &&
          stack[stack.length - 1].steps.length > 1,
      }
    );

    ctx.patchState({
      status: flowStatus,
    });
  }

  // ----------------------------------------------------------

  @Action(FlowResetStackStoreAction)
  resetStack(
    ctx: StateContext<FlowStoreModel>,
    action: FlowResetStackStoreAction
  ): void {
    const state = ctx.getState();
    if (action.reset) {
      ctx.patchState({
        stack: [],
      });
    }
  }

  // ----------------------------------------------------------

  @Action(FlowRemoveLastActionFromStackStoreAction)
  removeLastActionFromStack(
    ctx: StateContext<FlowStoreModel>,
    action: FlowRemoveLastActionFromStackStoreAction
  ): FlowActionModel | null {
    const state = ctx.getState();
    const stack = state.stack;
    if (action.remove && stack.length > 0) {
      const val = stack[stack.length - 1];
      ctx.patchState({
        stack: stack.filter((e, i) => i !== stack.length - 1),
      });
      return val ? val : null;
    }
    return null;
  }

  // ----------------------------------------------------------

  @Action(FlowStackFlowActionStoreAction)
  stackFlowAction(
    ctx: StateContext<FlowStoreModel>,
    action: FlowStackFlowActionStoreAction
  ): void {
    const state = ctx.getState();
    if (action.flowAction) {
      const stack = state.stack;
      ctx.patchState({
        stack: [...stack, action.flowAction],
      });
    }
  }

  // ----------------------------------------------------------

  @Action(FlowStackFlowStepInLastActionStoreAction)
  stackFlowStepInLastAction(
    ctx: StateContext<FlowStoreModel>,
    action: FlowStackFlowStepInLastActionStoreAction
  ): void {
    const state = ctx.getState();
    const lastAction =
      state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
    if (action.flowStep && lastAction) {
      const stack = state.stack;

      const newStepsData: any[] = [];

      lastAction.steps.forEach((step, i) => {
        newStepsData.push(Object.assign({}, step));
      });
      newStepsData.push(action.flowStep);

      newStepsData.forEach((step, i) => {
        step.isFirst = i === 0;
        step.isLast = i === newStepsData.length - 1;
        step.isCurrent = i === newStepsData.length - 1;
      });

      ctx.patchState({
        stack: [
          ...stack.filter((e, i) => i !== stack.length - 1),
          Object.assign({}, lastAction, {
            steps: [...newStepsData],
          }),
        ],
      });
    }
  }

  // ----------------------------------------------------------

  @Action(FlowRemoveLastFlowStepInLastActionStoreAction)
  removeLastFlowStepInLastAction(
    ctx: StateContext<FlowStoreModel>,
    action: FlowRemoveLastFlowStepInLastActionStoreAction
  ): void {
    const state = ctx.getState();
    const lastAction =
      state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
    if (action.remove && lastAction && lastAction.steps.length > 1) {
      const stack = state.stack;

      const newStepsData: any[] = [];

      lastAction.steps.forEach((step, i) => {
        if (i !== lastAction.steps.length - 1) {
          newStepsData.push(Object.assign({}, step));
        }
      });

      newStepsData.forEach((step, i) => {
        step.isCurrent = i === newStepsData.length - 1;
        step.isLast = i === newStepsData.length - 1;
        step.isFirst = i === 0;
      });

      ctx.patchState({
        stack: [
          ...stack.filter((e, i) => i !== stack.length - 1),
          Object.assign({}, lastAction, {
            steps: [...newStepsData],
          }),
        ],
      });
    }
  }

  // ----------------------------------------------------------
}
