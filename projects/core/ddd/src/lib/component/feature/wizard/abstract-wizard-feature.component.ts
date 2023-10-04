/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DynamicFormService } from '@ng-dynamic-forms/core';
import {
  FlowService,
  FlowStatusModel,
  FlowStoreState,
} from '@ng-techpromux-archetype-project/core-service';
import { Select } from '@ngxs/store';
import { Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { AbstractFeatureComponent } from '../abstract-feature.component';

@Component({
  template: '',
})
export abstract class AbstractWizardFeatureComponent
  extends AbstractFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  protected currentFlowStatus!: FlowStatusModel | null;

  protected currentStep: string | null = 'step1';

  protected currentStepIsFirstAccess: boolean | null = null;

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  protected flow: FlowService = inject<FlowService>(FlowService);

  private route: ActivatedRoute = inject<ActivatedRoute>(ActivatedRoute);

  protected formService: DynamicFormService =
    inject<DynamicFormService>(DynamicFormService);

  // ----------------------------------------------------------
  // OBSERVABLES
  // ----------------------------------------------------------

  @Select(FlowStoreState.getStatus)
  private currentFlowStatus$!: Observable<FlowStatusModel>;

  protected getCurrentFlowStatus$(): Observable<FlowStatusModel> {
    return this.currentFlowStatus$;
  }

  // ----------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();

    this.logger.console.debug(this.__classname, 'ngOnInit');

    this.addSubscription(
      this.getCurrentFlowStatus$()
        .pipe(
          tap((flowCurrentStatus: FlowStatusModel | null) => {
            this.logger.console.debug(
              this.__classname,
              'flowCurrentStatus',
              flowCurrentStatus
            );
          }),
          switchMap((flowCurrentStatus: FlowStatusModel | null) => {
            return forkJoin([
              of(flowCurrentStatus),
              this.route.paramMap.pipe(take(1)),
            ]);
          })
        )
        .subscribe(([flowCurrentStatus, params]) => {
          this.currentStep = params.get('step');
          this.logger.console.debug(
            this.__classname,
            'currentStep',
            this.currentStep
          );
          if (
            !flowCurrentStatus ||
            flowCurrentStatus.context !== this.getCurrentFlowContextName() ||
            flowCurrentStatus.module !== this.getCurrentFlowModuleName() ||
            flowCurrentStatus.action !== this.getCurrentFlowActionName() ||
            flowCurrentStatus.step !== this.currentStep
          ) {
            this.executeAction_Start();
            return;
          }

          if (this.currentStepIsFirstAccess === true) {
            this.currentStepIsFirstAccess = false;
          } else if (this.currentStepIsFirstAccess === null) {
            this.currentStepIsFirstAccess = true;
            this.initAction();
          }
          this.initCurrentStep();
        })
    );
  }

  // ---------------------------------------------------------

  protected abstract getCurrentFlowContextName(): string;

  protected abstract getCurrentFlowModuleName(): string;

  protected abstract getCurrentFlowActionName(): string;

  // ---------------------------------------------------------

  protected abstract initAction(): void;

  protected abstract initCurrentStep(): void;

  // ---------------------------------------------------------

  protected onClickBtn_Start(force: boolean = false): void {
    if (!force && this.isDisabledBtn_Start()) {
      return;
    }
    if (this.canExecuteAction_Start()) {
      this.executeAction_Start();
    }
  }

  @HostListener('window:flow-back-button-clicked', ['$event'])
  protected onClickBtn_Previous(force: boolean = false): void {
    if (!force && this.isDisabledBtn_Previous()) {
      return;
    }
    if (this.canExecuteAction_Previous()) {
      this.executeAction_Previous();
    }
  }

  protected onClickBtn_Next(force: boolean = false): void {
    if (!force && this.isDisabledBtn_Next()) {
      return;
    }
    if (this.canExecuteAction_Next()) {
      this.executeAction_Next();
    }
  }

  protected onClickBtn_End(force: boolean = false): void {
    if (!force && this.isDisabledBtn_End()) {
      return;
    }
    if (this.canExecuteAction_End()) {
      this.executeAction_End();
    }
  }

  protected onClickBtn_Exit(force: boolean = false): void {
    if (!force && this.isDisabledBtn_Exit()) {
      return;
    }
    if (this.canExecuteAction_Exit()) {
      this.executeAction_Exit();
    }
  }

  // ---------------------------------------------------------

  protected abstract isVisibleBtn_Start(): boolean;

  protected abstract isVisibleBtn_Previous(): boolean;

  protected abstract isVisibleBtn_Next(): boolean;

  protected abstract isVisibleBtn_End(): boolean;

  protected abstract isVisibleBtn_Exit(): boolean;

  // ---------------------------------------------------------

  protected abstract isDisabledBtn_Start(): boolean;

  protected abstract isDisabledBtn_Previous(): boolean;

  protected abstract isDisabledBtn_Next(): boolean;

  protected abstract isDisabledBtn_End(): boolean;

  protected abstract isDisabledBtn_Exit(): boolean;

  // ---------------------------------------------------------

  protected abstract canExecuteAction_Start(): boolean;

  protected abstract canExecuteAction_Previous(): boolean;

  protected abstract canExecuteAction_Next(): boolean;

  protected abstract canExecuteAction_End(): boolean;

  protected abstract canExecuteAction_Exit(): boolean;

  // ----------------------------------------------------------

  protected abstract executeAction_Start(): void;

  protected abstract executeAction_Previous(): void;

  protected abstract executeAction_Next(): void;

  protected abstract executeAction_End(): void;

  protected abstract executeAction_Exit(): void;

  // ----------------------------------------------------------
}
