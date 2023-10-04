/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';

import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { FlowActionModel } from '../model/flow-action.model';
import { FlowStepModel } from '../model/flow-step.model';
import { FlowChangeCurrentStatusStoreAction } from '../store/action/flow-change-current-status-store.action';
import { FlowRemoveLastActionFromStackStoreAction } from '../store/action/flow-remove-last-action-from-stack-store.action';
import { FlowRemoveLastFlowStepInLastActionStoreAction } from '../store/action/flow-remove-last-flow-step-in-last-action-store.action';
import { FlowResetStackStoreAction } from '../store/action/flow-reset-stack-store.action';
import { FlowStackFlowActionStoreAction } from '../store/action/flow-stack-flow-action-store.action';
import { FlowStackFlowStepInLastActionStoreAction } from '../store/action/flow-stack-flow-step-in-last-action-store.action';
import { FlowStatusModel } from '../store/model/flow-status.model';
import { FlowStoreState } from '../store/state/flow-data.state';

@Injectable()
export class FlowService extends AbstractService {
  private processingFlowNavigation: boolean = false;

  protected store: Store = inject<Store>(Store);

  protected router: Router = inject<Router>(Router);

  protected activatedRoute: ActivatedRoute =
    inject<ActivatedRoute>(ActivatedRoute);

  private subscription!: Subscription;

  constructor() {
    super();
  }

  // -----------------------------------------------------------------------

  init(): void {
    this.logger.console.debug(this.__classname, 'init');

    if (!this.subscription) {
      this.subscription = this.router.events.subscribe(($event) => {
        if (!($event instanceof NavigationEnd)) {
          return;
        }

        if (this.processingFlowNavigation) {
          return;
        }

        this.logger.console.debug(this.__classname, 'NavigationEnd');

        let route = this.store.selectSnapshot(
          (state) => state.router?.state?.root?.firstChild
        );

        let child = route;

        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            route = child;
          } else {
            child = null;
          }
        }

        this.logger.console.debug(this.__classname, 'route', route);

        const routeData = route.data;

        this.logger.console.debug(this.__classname, 'route -> data', routeData);

        const flowDataConfig = routeData?.flowData;

        this.logger.console.debug(
          this.__classname,
          'flowDataConfig',
          flowDataConfig
        );

        if (!flowDataConfig) {
          const navigatedUrl = this.store.selectSnapshot<any>(
            (state) => state.router?.state?.url
          );
          this.logger.console.warn(
            this.__classname,
            'Navigation to [' + navigatedUrl + '] without flow data info!!!'
          );
          return;
        }

        this.checkAndProcessFlowConfigForNavigation(flowDataConfig);
      });
    }
  }

  protected checkAndProcessFlowConfigForNavigation(flowDataConfig: any): void {
    this.logger.console.debug(
      this.__classname,
      'checkAndProcessFlowConfigForNavigation',
      flowDataConfig
    );
    const realContextName = (
      flowDataConfig.context ? flowDataConfig.context : ''
    ).toLowerCase();
    const realModuleName = (
      flowDataConfig.module ? flowDataConfig.module : ''
    ).toLowerCase();
    const realActionName = (
      flowDataConfig.action ? flowDataConfig.action : ''
    ).toLowerCase();
    const realStepName = (
      flowDataConfig.step ? flowDataConfig.step : ''
    ).toLowerCase();

    const lastAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getCurrentFlowAction
      );

    if (
      realContextName === lastAction?.context &&
      realModuleName === lastAction?.module &&
      realActionName === lastAction?.action
    ) {
      return;
    }

    this.processNewFlowDataStatus(
      {
        context: realContextName,
        module: realModuleName,
        action: realActionName,
        steps: [
          {
            step: realStepName && realStepName !== '' ? realStepName : '',
            params: {},
            isCurrent: true,
            isFirst: true,
            isLast: true,
          },
        ],
      },
      {
        context: realContextName,
        module: realModuleName,
        action: realActionName,

        step: realStepName && realStepName !== '' ? realStepName : '',
        stepParams: {},
        stepIsFirst: true,
        stepIsLast: true,

        isReturned: false,
        isReturnedConfirmed: false,
        isReturnedCanceled: false,
        isReturnedClosed: false,
        isReturnedWithParams: null,

        flowActionProcessed: 'open-action',
      },
      true
    ).then();
  }

  // -----------------------------------------------------------------------

  protected dispatchCurrentStatus(current: FlowStatusModel): void {
    this.store
      .dispatch(new FlowChangeCurrentStatusStoreAction(current))
      .subscribe(() => {
        //
      });
  }

  protected processNewFlowDataStatus(
    flowActionData: any | null,
    flowStatusData: any | null,
    resetOthers: boolean = false
  ): Promise<boolean> {
    this.logger.console.debug(
      this.__classname,
      'processNewFlowDataStatus',
      flowActionData,
      flowStatusData,
      resetOthers
    );
    if (flowActionData) {
      const flowAction = this.createFlowAction(flowActionData);
      this.stackFlowAction(flowAction, resetOthers);
    }
    if (flowStatusData) {
      const flowStatus = this.createFlowStatus(flowStatusData);
      this.dispatchCurrentStatus(flowStatus);
    }
    return Promise.resolve(true);
  }

  // -----------------------------------------------------------------------

  private createFlowAction(data: FlowActionModel | any = {}): FlowActionModel {
    this.logger.console.debug(this.__classname, 'createFlowAction', data);
    return Object.assign<FlowActionModel, any>(
      {
        context: '',
        module: '',
        action: '',
        steps: [
          {
            step: '',
            params: null,
            isCurrent: true,
            isFirst: true,
            isLast: true,
          },
        ],
      },
      data
    );
  }

  private stackFlowAction(
    flowAction: FlowActionModel | null,
    resetOthers: boolean = false
  ): void {
    this.logger.console.debug(
      this.__classname,
      'stackFlowAction',
      flowAction,
      resetOthers
    );
    if (resetOthers) {
      this.store.dispatch(new FlowResetStackStoreAction(true)).subscribe(() => {
        //
      });
    }
    if (flowAction) {
      this.store
        .dispatch(new FlowStackFlowActionStoreAction(flowAction))
        .subscribe(() => {
          //
        });
    }
  }

  private stackFlowStepInLastAction(flowStep: FlowStepModel | null): void {
    this.logger.console.debug(
      this.__classname,
      'stackFlowStepInLastAction',
      flowStep
    );
    if (flowStep) {
      this.store
        .dispatch(new FlowStackFlowStepInLastActionStoreAction(flowStep))
        .subscribe(() => {
          //
        });
    }
  }

  private removeLastFlowStepInLastAction(remove: boolean = true): void {
    this.logger.console.debug(
      this.__classname,
      'removeLastFlowStepInLastAction',
      remove
    );
    if (remove) {
      this.store
        .dispatch(new FlowRemoveLastFlowStepInLastActionStoreAction(true))
        .subscribe(() => {
          //
        });
    }
  }

  private createFlowStatus(data: FlowStatusModel | any = {}): FlowStatusModel {
    this.logger.console.debug(this.__classname, 'createFlowStatus', data);
    const flowStatus: FlowStatusModel = Object.assign<FlowStatusModel, any>(
      {
        context: '',
        module: '',
        action: '',

        step: '',
        stepParams: '',
        stepIsFirst: true,
        stepIsLast: true,

        isHome: true,
        isDashboard: true,

        isReturned: false,
        isReturnedConfirmed: false,
        isReturnedCanceled: false,
        isReturnedClosed: false,
        isReturnedWithParams: null,

        flowActionProcessed: '',
      },
      data
    );

    return Object.assign<FlowStatusModel, any>(flowStatus, {
      isHome:
        (flowStatus.context === '' &&
          flowStatus.module === '' &&
          flowStatus.action === '') ||
        (flowStatus.context === '' &&
          flowStatus.module === 'home' &&
          flowStatus.action === '') ||
        (flowStatus.context === '' &&
          flowStatus.module === '' &&
          flowStatus.action === 'home') ||
        (flowStatus.context === '' &&
          flowStatus.module === 'home' &&
          flowStatus.action === 'home'),
      isDashboard:
        (flowStatus.context === '' &&
          flowStatus.module === 'dashboard' &&
          flowStatus.action === '') ||
        (flowStatus.context === '' &&
          flowStatus.module === '' &&
          flowStatus.action === 'dashboard') ||
        (flowStatus.context === '' &&
          flowStatus.module === '' &&
          flowStatus.action === 'dashboard') ||
        (flowStatus.context === '' &&
          flowStatus.module === 'dashboard' &&
          flowStatus.action === 'dashboard'),
    });
  }

  // -----------------------------------------------------------------------

  private navigateToModuleActionStep(
    context: string,
    module: string,
    action: string,
    step: string | null = null,
    params: any | null = {}
  ): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'navigateToModuleActionStep', {
      context,
      module,
      action,
      step,
      params,
    });

    if (context === null || module === null || action === null) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const contextPath = (
      (context !== '' ? '/' : '') + context
    ).toLocaleLowerCase();
    const modulePath = (
      (module !== '' ? '/' : '') + module
    ).toLocaleLowerCase();
    const actionPath = (
      (action !== '' ? '/' : '') + action
    ).toLocaleLowerCase();

    const stepPath = ((step !== '' ? '/' : '') + step).toLocaleLowerCase();

    const url = contextPath + modulePath + actionPath + stepPath;

    const routeParams = Object.assign({}, params ? params : {});

    this.logger.console.debug(
      this.__classname,
      'Navigate to URL',
      url,
      routeParams
    );

    if (url === '' || url === '/') {
      return this.router.navigate(['']).then(
        (executed) => {
          if (executed) {
            this.logger.console.debug(
              this.__classname,
              'Navigation Successfully Executed!!!',
              url,
              routeParams
            );
          }
          return executed;
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          return false;
        }
      );
    }

    let parsedUrl = url;

    Object.keys(routeParams).forEach((key) => {
      if (parsedUrl.indexOf(':' + key) !== -1) {
        parsedUrl = parsedUrl.replace(':' + key, routeParams[key]);
        delete routeParams[key];
      }
    });

    return this.router.navigate([parsedUrl, routeParams]).then(
      (executed) => {
        if (executed) {
          this.logger.console.debug(
            this.__classname,
            'Navigation Successfully Executed!!!',
            url,
            routeParams
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  private removeLastActionAndNavigateToPreviousAction(
    params: any | null = null,
    returned: boolean = true,
    closed: boolean = false,
    canceled: boolean = false,
    confirmed = false
  ): Promise<boolean> {
    const currentAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getCurrentFlowAction
      );
    if (!currentAction) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const previousAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getPreviousFlowAction
      );

    this.store
      .dispatch(new FlowRemoveLastActionFromStackStoreAction(true))
      .subscribe(() => {
        //
      });

    if (!previousAction) {
      return this.navigateToModuleActionStep('', '', '', '', {});
    }

    const previousCurrentStep: FlowStepModel | undefined =
      previousAction?.steps?.find(
        (previousStep: FlowStepModel, i: number) => previousStep.isCurrent
      );

    if (!previousCurrentStep) {
      this.logger.console.error(this.__classname, 'Operation Error!!!');
      return Promise.reject('Operation ERROR!!');
    }

    return this.navigateToModuleActionStep(
      previousAction.context,
      previousAction.module,
      previousAction.action,
      previousCurrentStep.step,
      previousCurrentStep.params
    ).then(
      (executed) => {
        if (executed) {
          this.dispatchCurrentStatus(
            this.createFlowStatus({
              context: previousAction.context,
              module: previousAction.module,
              action: previousAction.action,

              step: previousCurrentStep.step,
              stepParams: previousCurrentStep.params,
              stepIsFirst: previousCurrentStep.isFirst,
              stepIsLast: previousCurrentStep.isLast,

              isReturned: returned,
              isReturnedConfirmed: confirmed,
              isReturnedCanceled: canceled,
              isReturnedClosed: closed,
              isReturnedWithParams: params,

              flowActionProcessed: 'close-current-action',
            })
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  // -----------------------------------------------------------------------

  public startAction(
    context: string,
    module: string,
    action: string | null = null,
    step: string | null = null,
    params: any | null = {},
    resetOthers: boolean = false
  ): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'startAction', {
      context,
      module,
      action,
      step,
      params,
      resetOthers,
    });

    const realContextName = (context ? context : '').toLowerCase();
    const realModuleName = (module ? module : '').toLowerCase();
    const realActionName = (action ? action : '').toLowerCase();
    const realStepName = (step ? step : '').toLowerCase();

    if (resetOthers) {
      this.stackFlowAction(null, true);
    }

    this.processingFlowNavigation = true;

    return this.navigateToModuleActionStep(
      realContextName,
      realModuleName,
      realActionName,
      realStepName,
      params
    ).then(
      (executed) => {
        if (executed) {
          this.processNewFlowDataStatus(
            {
              context: realContextName,
              module: realModuleName,
              action: realActionName,
              steps: [
                {
                  step: realStepName && realStepName !== '' ? realStepName : '',
                  params,
                  isCurrent: true,
                  isFirst: true,
                  isLast: true,
                },
              ],
            },
            {
              context: realContextName,
              module: realModuleName,
              action: realActionName,

              step: realStepName && realStepName !== '' ? realStepName : '',
              stepParams: params,
              stepIsFirst: true,
              stepIsLast: true,

              isReturned: false,
              isReturnedConfirmed: false,
              isReturnedCanceled: false,
              isReturnedClosed: false,
              isReturnedWithParams: null,

              flowActionProcessed: 'open-action',
            },
            resetOthers
          ).then(() => {
            setTimeout(() => {
              this.processingFlowNavigation = false;
            }, 200);
          });
        } else {
          setTimeout(() => {
            this.processingFlowNavigation = false;
          }, 200);
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  public startStep(
    context: string,
    module: string,
    action: string,
    step: string,
    params: any | null = {},
    disableBackward: boolean = false
  ): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'startStep', {
      context,
      module,
      action,
      step,
      params,
    });

    const currentAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getCurrentFlowAction
      );

    this.logger.console.debug(this.__classname, 'currentAction', currentAction);

    if (!currentAction) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const realContextName = (context ? context : '').toLowerCase();
    const realModuleName = (module ? module : '').toLowerCase();
    const realActionName = (action ? action : '').toLowerCase();
    const realStepName = (step ? step : '').toLowerCase();

    if (
      currentAction.context !== realContextName ||
      currentAction.module !== realModuleName ||
      currentAction.action !== realActionName
    ) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const currentStep: FlowStepModel | undefined = currentAction.steps.find(
      (stepData: FlowStepModel, i) => stepData.isCurrent
    );

    if (currentStep) {
      if (currentStep.step === realStepName) {
        this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
        return Promise.reject('Operation Not Allowed!!!');
      }
    }

    return this.navigateToModuleActionStep(
      realContextName,
      realModuleName,
      realActionName,
      realStepName,
      params
    )
      .then(
        (executed) => {
          if (executed) {
            if (executed) {
              this.stackFlowStepInLastAction({
                step: realStepName && realStepName !== '' ? realStepName : '',
                params,
                isCurrent: true,
                isFirst: false,
                isLast: true,
              });
            }
          }
          return executed;
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          return false;
        }
      )
      .then(
        (executed) => {
          if (executed) {
            this.dispatchCurrentStatus(
              this.createFlowStatus({
                context: realContextName,
                module: realModuleName,
                action: realActionName,

                step: realStepName && realStepName !== '' ? realStepName : '',
                stepParams: params,
                stepIsFirst: false,
                stepIsLast: true,

                isReturned: false,
                isReturnedConfirmed: false,
                isReturnedCanceled: false,
                isReturnedClosed: false,
                isReturnedWithParams: null,

                flowActionCanBackward: disableBackward ? false : true, // stepConfig?.canBackwardToPreviousStep === false ? false : null, // false //
                flowActionProcessed: 'open-step',
              })
            );
          }
          return executed;
        },
        (error: any) => {
          this.logger.console.error(this.__classname, error);
          return false;
        }
      );
  }

  public stepBackward(params: any | null = null): Promise<boolean> {
    const currentAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getCurrentFlowAction
      );

    if (!currentAction) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const currentStep: FlowStepModel | undefined = currentAction.steps.find(
      (realStepName: FlowStepModel, i) => realStepName.isCurrent
    );

    if (!currentStep) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    const previousStep: FlowStepModel | undefined = currentAction.steps.find(
      (realStepName: FlowStepModel, i) =>
        i < currentAction.steps.length - 1 &&
        currentAction.steps[i + 1].isCurrent
    );

    if (!previousStep) {
      this.logger.console.error(this.__classname, 'Operation Not Allowed!!!');
      return Promise.reject('Operation Not Allowed!!!');
    }

    this.removeLastFlowStepInLastAction(true);

    this.processingFlowNavigation = true;

    return this.navigateToModuleActionStep(
      currentAction.context,
      currentAction.module,
      currentAction.action,
      previousStep.step,
      previousStep.params
    ).then(
      (executed) => {
        if (executed) {
          this.processNewFlowDataStatus(
            null,
            {
              context: currentAction.context,
              module: currentAction.module,
              action: currentAction.action,

              step: previousStep.step,
              stepParams: previousStep.params,
              stepIsFirst: previousStep.isFirst,
              stepIsLast: previousStep.isLast,

              isReturned: false,
              isReturnedConfirmed: false,
              isReturnedCanceled: false,
              isReturnedClosed: false,
              isReturnedWithParams: params,

              flowActionProcessed: 'step-backward',
            },
            false
          ).then(() => {
            setTimeout(() => {
              this.processingFlowNavigation = false;
            }, 200);
          });
        } else {
          setTimeout(() => {
            this.processingFlowNavigation = false;
          }, 200);
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  // -----------------------------------------------------------------------

  public closeAll(
    params: any | null = null,
    forceNavigate: boolean = false
  ): Promise<boolean> {
    this.logger.console.debug(
      this.__classname,
      'closeAll',
      params,
      forceNavigate
    );
    const currentAction: FlowActionModel | null =
      this.store.selectSnapshot<FlowActionModel | null>(
        FlowStoreState.getCurrentFlowAction
      );

    const returned = !currentAction;

    this.stackFlowAction(null, true);

    if (!forceNavigate) {
      return Promise.resolve(true);
    }
    return this.navigateToModuleActionStep('', '', '').then(
      (executed) => {
        if (executed) {
          this.dispatchCurrentStatus(
            this.createFlowStatus({
              context: '',
              module: '',
              action: '',

              step: '',
              stepParams: null,
              stepIsFirst: true,
              stepIsLast: true,

              isReturned: returned,
              isReturnedConfirmed: false,
              isReturnedCanceled: false,
              isReturnedClosed: true,
              isReturnedWithParams: params,

              flowActionProcessed: 'close-all',
            })
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  public closeCurrentAction(params: any | null = null): Promise<boolean> {
    return this.removeLastActionAndNavigateToPreviousAction(
      params,
      true,
      true,
      false,
      false
    ).then(
      (executed) => {
        if (executed) {
          this.logger.console.debug(
            this.__classname,
            'Action Successfully Closed!!!'
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  public cancelCurrentAction(params: any | null = null): Promise<boolean> {
    return this.removeLastActionAndNavigateToPreviousAction(
      params,
      true,
      false,
      true,
      false
    ).then(
      (executed) => {
        if (executed) {
          this.logger.console.debug(
            this.__classname,
            'Action Successfully Canceled!!!'
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  public confirmCurrentAction(params: any | null = null): Promise<boolean> {
    return this.removeLastActionAndNavigateToPreviousAction(
      params,
      true,
      false,
      false,
      true
    ).then(
      (executed) => {
        if (executed) {
          this.logger.console.debug(
            this.__classname,
            'Action Successfully Confirmed!!!'
          );
        }
        return executed;
      },
      (error: any) => {
        this.logger.console.error(this.__classname, error);
        return false;
      }
    );
  }

  // -----------------------------------------------------------------------
}
