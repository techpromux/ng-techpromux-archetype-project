/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractWizardFeatureComponent } from '../wizard/abstract-wizard-feature.component';

@Component({
  template: '',
})
export abstract class AbstractWizardFormFeatureComponent
  extends AbstractWizardFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  formGroup!: FormGroup;

  formIsCreated: boolean = false;

  formIsEditable: boolean = true;

  formIsVisible: boolean = true;

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  protected fb: FormBuilder = inject<FormBuilder>(FormBuilder);

  // ----------------------------------------------------------
  // OBSERVABLES
  // ----------------------------------------------------------

  // ----------------------------------------------------------

  constructor() {
    super();
    this.formGroup = this.fb.group({});
    this.initFormGroup();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ---------------------------------------------------------

  protected abstract initFormGroup(): void;

  protected override initCurrentStep(): void {
    this.logger.console.debug(
      this.__classname,
      'initCurrentStep',
      this.currentStep
    );

    switch (this.currentStep) {
      case 'step1':
        this.formIsEditable = true;
        this.formIsVisible = true;
        break;
      case 'step2':
        this.formIsEditable = false;
        this.formIsVisible = true;
        break;
      case 'step3':
        this.formIsEditable = false;
        this.formIsVisible = false;
        break;
      default:
    }

    this.logger.console.debug(
      this.__classname,
      'formIsEditable && formIsVisible',
      this.formIsEditable,
      this.formIsVisible
    );
  }

  protected onFormGroupCreated(form: FormGroup): void {
    setTimeout(() => {
      this.formIsCreated = true;
    }, 100);
  }

  protected isFormGroupValid(): boolean {
    return this.formIsCreated && this.formGroup && this.formGroup.valid;
  }

  // -------------------------------------------------------------------------------

  protected override isVisibleBtn_Start(): boolean {
    return this.currentStep === 'step3';
  }

  protected override isVisibleBtn_Previous(): boolean {
    return this.currentStep === 'step2';
  }

  protected override isVisibleBtn_Next(): boolean {
    return this.currentStep === 'step1';
  }

  protected override isVisibleBtn_End(): boolean {
    return this.currentStep === 'step2';
  }

  protected override isVisibleBtn_Exit(): boolean {
    return this.currentStep === 'step1' || this.currentStep === 'step3';
  }

  // -------------------------------------------------------------------------------

  protected override isDisabledBtn_Start(): boolean {
    return this.currentStep !== 'step3';
  }

  protected override isDisabledBtn_Previous(): boolean {
    return this.currentStep !== 'step2';
  }

  protected override isDisabledBtn_Next(): boolean {
    return this.currentStep !== 'step1';
  }

  protected override isDisabledBtn_End(): boolean {
    return this.currentStep !== 'step2';
  }

  protected override isDisabledBtn_Exit(): boolean {
    return false;
  }

  // -------------------------------------------------------------------------------

  protected override canExecuteAction_Start(): boolean {
    return this.currentStep === 'step3';
  }

  protected override canExecuteAction_Previous(): boolean {
    return this.currentStep === 'step2';
  }

  protected override canExecuteAction_Next(): boolean {
    return this.currentStep === 'step1';
  }

  protected override canExecuteAction_End(): boolean {
    return this.currentStep === 'step2';
  }

  protected override canExecuteAction_Exit(): boolean {
    return true;
  }

  // -------------------------------------------------------------------------------
}
