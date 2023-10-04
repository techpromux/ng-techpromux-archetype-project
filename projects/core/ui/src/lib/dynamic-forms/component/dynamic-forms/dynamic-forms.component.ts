/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AbstractControlOptions,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicFormService,
  DynamicFormValueControlModel,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { TranslationService } from '@ng-techpromux-archetype-project/core-service';
import { DynamicNGxBootstrapFormComponent } from '@ng-techpromux-archetype-project/ext-ng-dynamic-forms-ui-ngx-bootstrap';

import {
  BehaviorSubject,
  Observable,
  Subject,
  forkJoin,
  of,
  timer,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  take,
} from 'rxjs/operators';

@Component({
  selector: 'techpromux-ui-dynamic-forms-default',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormsComponent
  extends AbstractComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild(DynamicNGxBootstrapFormComponent, { static: false })
  formComponent!: DynamicNGxBootstrapFormComponent;

  @Input() formModel!: DynamicFormModel;

  @Input() formLayout!: DynamicFormLayout;

  @Input() formOptions!: AbstractControlOptions;

  @Input() customModelControlsTpl: any[] = [];

  @Input() markAllAsReadOnly: boolean | null = null;

  @Input() keepFormValuesOnChanges: boolean = true;

  @Input() defaultFormLayout = {
    container:
      'dynamic-form-custom-container container-fluid form-control-show-valid-mark form-control-show-invalid-mark',
    group: 'dynamic-form-custom-group row',
  };

  @Input() defaultFormControlLayout: any = {
    element: {
      host: 'df-control-host1 col-lg-4 col-md-6 col-sm-6 col-xs-12',
      container: 'df-control-container1',
      group: 'df-control-group1',
      label: 'df-control-label1',
      control: 'df-control-control1',

      children: 'df-control-children1',
      errors: 'df-control-errors1 alert alert-danger mt-2',
      hint: 'df-control-hint1',
      option: 'df-control-option1',
    },
    grid: {
      host: 'df-control-host2 col-lg-4 col-md-6 col-sm-6 col-xs-12', // col-sm-3 col-xs-12,
      container: 'df-control-container2',
      group: 'df-control-group2',
      label: 'df-control-label2',
      control: 'df-control-control2',
      children: 'df-control-children2',
      errors: 'df-control-errors2 alert alert-danger mt-2',
      hint: 'df-control-hint2',
      option: 'df-control-option2',
    },
  };

  @Input() defaultFormGroupLayout = {
    element: {
      host: 'df-control-host3 col-md-12 col-sm-12 col-xs-12',
      container: 'df-control-container3',
      group: 'df-control-group3',
      label: 'df-control-label3',
      control: 'df-control-control3 row', // row,

      children: 'df-control-children3 col-lg-4 col-md-6 col-sm-6 col-xs-12',
      errors: 'df-control-errors3 alert alert-danger mt-2',
      hint: 'df-control-hint3',
      option: 'df-control-option3',
    },
    grid: {
      host: 'df-control-host4 col-md-12 col-sm-12 col-xs-12', // col-sm-12 col-xs-12,
      container: 'df-control-container4',
      group: 'df-control-group4',
      label: 'df-control-label4',
      control: 'df-control-control4',
      children: 'df-control-children4 col-lg-4 col-md-6 col-sm-6 col-xs-12', // col-sm-3 col-xs-12',
      errors: 'df-control-errors4 alert alert-danger mt-2',
      hint: 'df-control-hint4',
      option: 'df-control-option4',
    },
  };

  @Input() defaultFormArrayLayout = {
    element: {
      host: 'df-control-host5 col-md-12 col-sm-12 col-xs-12',
      container: 'df-control-container5 mb-0',
      group: 'df-control-group5 row',
      label: 'df-control-label5',
      control: 'df-control-control5',

      children: 'df-control-children5 col-lg-4 col-md-6 col-sm-6 col-xs-12',
      errors: 'df-control-errors5 alert alert-danger mt-2',
      hint: 'df-control-hint5',
      option: 'df-control-option5',
    },
    grid: {
      host: 'df-control-host6 col-md-12 col-sm-12 col-xs-12', // col-sm-12 col-xs-12,
      container: 'df-control-container6 mb-0',
      group: 'df-control-group6 row', // row,
      label: 'df-control-label6',
      control: 'df-control-control6',
      children: 'df-control-children6 col-lg-4 col-md-6 col-sm-6 col-xs-12', // col-sm-3 col-xs-12',
      errors: 'df-control-errors6 alert alert-danger mt-2',
      hint: 'df-control-hint6',
      option: 'df-control-option6',
    },
  };

  @Input() showDefaultErrorsTpl: boolean = true;

  @Input() defaultFormErrorsTplLayout = {
    classes: {
      container:
        'df-control-errors2 dynamic-form-custom-default-errors-tpl alert alert-danger mt-2',
      message: 'invalid-feedback d-block mb-0',
    },
  };

  @Input() showDefaultArraysEndTpl: boolean = true;

  @Input() defaultFormArrayEndTplLayout = {
    classes: {
      actions_container: 'df-actions_container d-flex justify-content-end col',
      actions_label: 'df-actions_label d-none- d-xs-block',
      actions_text_align:
        'df-actions_text_align text-right d-flex align-items-end',
      actions_btn_insert: 'df-actions_btn_insert btn btn-outline-dark me-2',
      actions_btn_insert_icon: 'df-actions_btn_insert_icon',
      actions_btn_insert_icon_name: 'cib-addthis',
      actions_btn_add: 'df-actions_btn_add btn btn-outline-dark me-2',
      actions_btn_add_icon: 'df-actions_btn_add_icon',
      actions_btn_add_icon_name: 'cib-addthis',
      actions_btn_remove: 'df-actions_btn_remove btn btn-outline-danger',
      actions_btn_remove_icon: 'df-actions_btn_remove_icon',
      actions_btn_remove_icon_name: 'cil-trash',
    },
    labels: {
      actions_btn_insert_lbl: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_insert_lbl'
      ),
      actions_btn_insert_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_insert_title'
      ),
      actions_btn_add_lbl: _i18n('ui.dynamic-forms.arrays.actions_btn_add_lbl'),
      actions_btn_add_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_add_title'
      ),
      actions_btn_remove_lbl: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_remove_lbl'
      ),
      actions_btn_remove_title: _i18n(
        'ui.dynamic-forms.arrays.actions_btn_remove_lbl'
      ),
    },
    behaviors: {
      show_actions_btn_insert: true,
      show_actions_btn_add: true,
      show_actions_btn_remove: true,

      disable_action_btn_remove_in_only_item: true,

      show_hr_line_between_items: false,
      show_hr_line_in_last_item: false,
    },
  };

  @Input() useCustomArrayBtnTranslationsPrefix: boolean = false;

  @Input() customArrayBtnTranslationsPrefix: string = 'app.ui.dynamic-forms';

  // ---------------------------------------------------------------------------------------

  @Output() formGroupCreated: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

  @Output() formModelUpdated: EventEmitter<DynamicFormModel> =
    new EventEmitter<DynamicFormModel>();

  @Output() formLayoutUpdated: EventEmitter<DynamicFormLayout> =
    new EventEmitter<DynamicFormLayout>();

  _formGroup!: FormGroup;

  _formModel!: DynamicFormModel;

  _formModelSimpleControls: DynamicFormControlModel[] = [];

  _formLayout!: DynamicFormLayout;

  _isFormGroupCreated = false;

  _isFormModelUpdated = false;

  _isFormLayoutUpdated = false;

  public dynamicFormService: DynamicFormService =
    inject<DynamicFormService>(DynamicFormService);

  public translation: TranslationService =
    inject<TranslationService>(TranslationService);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.addSubscription(
      this.translation.translate.onLangChange
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          filter(
            (lang) => this._isFormGroupCreated && this._isFormModelUpdated
          ),
          switchMap((lang) => {
            this._isFormModelUpdated = false;
            return this.customizeFormModelTranslationLogic(
              this._formModel
            ).pipe(take(1));
          }),
          switchMap((formModelUpdated) => {
            this._isFormModelUpdated = false;
            this._formModelSimpleControls = this.getFormModelSimpleControls(
              formModelUpdated as DynamicFormModel
            );
            this._formModel = formModelUpdated as DynamicFormModel;
            this._isFormModelUpdated = true;
            this.formModelUpdated.emit(this._formModel);
            return of(this._formModel);
          })
        )
        .subscribe((lang) => {
          this.formComponentDetectChanges();
        })
    );
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    let oldFormGroupValue = {};
    if (this._formGroup && this.keepFormValuesOnChanges) {
      oldFormGroupValue = this._formGroup.getRawValue();
    }
    this._isFormModelUpdated = false;
    this._isFormGroupCreated = false;
    this._isFormLayoutUpdated = false;

    this.addSubscription(
      of(true)
        .pipe(
          switchMap(() => this.customizeFormModel(this.formModel)),
          switchMap((formModelUpdated) => {
            if (formModelUpdated) {
              this._formModelSimpleControls =
                this.getFormModelSimpleControls(formModelUpdated);
              this._formModel = formModelUpdated;
              this._isFormModelUpdated = true;
              this.formModelUpdated.emit(this._formModel);
            }
            return this.customizeDefaultFormLayout({}, this._formModel);
          }),
          switchMap((formLayoutUpdated) => {
            this._formLayout = Object.assign(
              {},
              formLayoutUpdated,
              this.formLayout
            );
            this._isFormLayoutUpdated = true;
            this.formLayoutUpdated.emit(this._formLayout);
            return this.createFormGroup(this.formModel, this.formOptions);
          }),
          switchMap((formGroupCreated) => {
            if (formGroupCreated) {
              formGroupCreated.patchValue(oldFormGroupValue);
            }
            return this.customizeFormGroup(formGroupCreated as FormGroup<any>);
          }),
          switchMap((formGroupUpdated) => {
            this._formGroup = formGroupUpdated as any;
            this._isFormGroupCreated = true;
            this.formGroupCreated.emit(this._formGroup);
            return of(formGroupUpdated);
          }),
          take(1)
        )
        .subscribe((formModelUpdated) => {
          this.formComponentDetectChanges();
        })
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ----------------------------------------------------------------

  protected formComponentDetectChanges(): void {
    if (this.formComponent) {
      this.dynamicFormService.detectChanges(this.formComponent);
    }
  }

  // ----------------------------------------------------------------

  protected createFormGroup(
    formModel: DynamicFormModel,
    formOptions?: AbstractControlOptions
  ): Observable<FormGroup | null> {
    const formGroupCreated$: Subject<FormGroup | null> =
      new BehaviorSubject<FormGroup | null>(null);
    if (!formModel) {
      formGroupCreated$.next(null);
    } else {
      const formGroup = this.dynamicFormService.createFormGroup(
        formModel,
        formOptions
      );
      formGroupCreated$.next(formGroup);
    }
    return formGroupCreated$.asObservable();
  }

  protected customizeFormGroup(
    formGroup: FormGroup
  ): Observable<FormGroup | null> {
    const formGroupUpdated$: Subject<FormGroup | null> =
      new BehaviorSubject<FormGroup | null>(null);
    if (!formGroup) {
      formGroupUpdated$.next(null);
    } else {
      this.addSubscription(
        formGroup.valueChanges
          .pipe(debounceTime(200), distinctUntilChanged())
          .subscribe(() => {
            this.customizeFormGroupUpdateArrayIndex();
          })
      );

      formGroupUpdated$.next(formGroup);
    }
    return formGroupUpdated$.asObservable();
  }

  protected customizeFormGroupUpdateArrayIndex(): void {
    this.addSubscription(
      timer(200, 250)
        .pipe(take(5))
        .subscribe(() => {
          const array_indexs = document.getElementsByClassName(
            'df-form-control-array-index'
          );
          if (array_indexs) {
            for (let i = array_indexs.length - 1; i >= 0; i--) {
              const array_idx = (array_indexs[i] as HTMLInputElement).value;
              const children = array_indexs
                .item(i)
                ?.parentElement?.getElementsByClassName(
                  'df-form-control-item-index'
                );
              if (children) {
                for (let j = 0; j < children.length; j++) {
                  if ((children[j] as HTMLInputElement).value !== array_idx) {
                    (children[j] as HTMLInputElement).value = array_idx;
                  }
                }
              }
            }
          }
        })
    );
  }

  // ----------------------------------------------------------------

  protected customizeDefaultFormLayout(
    formLayout: DynamicFormLayout,
    formModel: DynamicFormModel
  ): Observable<DynamicFormLayout> {
    const formLayoutCreated$: Subject<DynamicFormLayout> =
      new BehaviorSubject<DynamicFormLayout>({});
    if (!formLayout || !formModel) {
      formLayoutCreated$.next({});
    } else {
      formModel.forEach((controlModel) => {
        const defaultFormControlLayout = JSON.parse(
          JSON.stringify(this.defaultFormControlLayout)
        );
        const defaultFormGroupLayout = JSON.parse(
          JSON.stringify(this.defaultFormGroupLayout)
        );
        const defaultFormArrayLayout = JSON.parse(
          JSON.stringify(this.defaultFormArrayLayout)
        );

        const controlModelLayout = controlModel.layout
          ? controlModel.layout
          : {};

        if (controlModel instanceof DynamicFormValueControlModel) {
          formLayout[controlModel.id] = Object.assign(
            {},
            defaultFormControlLayout,
            controlModelLayout,
            {
              element: Object.assign(
                {},
                defaultFormControlLayout.element,
                controlModelLayout.element
              ),
              grid: Object.assign(
                {},
                defaultFormControlLayout.grid,
                controlModelLayout.grid
              ),
            }
          );
        } else if (controlModel instanceof DynamicFormGroupModel) {
          formLayout[controlModel.id] = Object.assign(
            {},
            defaultFormGroupLayout,
            controlModelLayout,
            {
              element: Object.assign(
                {},
                defaultFormGroupLayout.element,
                controlModelLayout.element
              ),
              grid: Object.assign(
                {},
                defaultFormGroupLayout.grid,
                controlModelLayout.grid
              ),
            }
          );
        } else if (controlModel instanceof DynamicFormArrayModel) {
          formLayout[controlModel.id] = Object.assign(
            {},
            defaultFormArrayLayout,
            controlModelLayout,
            {
              element: Object.assign(
                {},
                defaultFormArrayLayout.element,
                controlModelLayout.element
              ),
              grid: Object.assign(
                {},
                defaultFormArrayLayout.grid,
                controlModelLayout.grid
              ),
            }
          );
        }

        if (
          formLayout[controlModel.id].element &&
          formLayout[controlModel.id].grid
        ) {
          (formLayout[controlModel.id] as any).element.host +=
            ' df-control-type-' + (controlModel.type as string).toLowerCase();
          (formLayout[controlModel.id] as any).grid.host +=
            ' df-control-type-' + (controlModel.type as string).toLowerCase();
          if (controlModel instanceof DynamicInputModel) {
            (formLayout[controlModel.id] as any).element.host +=
              ' df-control-type-input-' +
              (
                (controlModel as DynamicInputModel).inputType as string
              ).toLowerCase();
            (formLayout[controlModel.id] as any).grid.host +=
              ' df-control-type-input-' +
              (
                (controlModel as DynamicInputModel).inputType as string
              ).toLowerCase();
          }
        }
      });
      formLayoutCreated$.next(formLayout);
    }
    return formLayoutCreated$.asObservable();
  }

  // ----------------------------------------------------------------

  protected customizeFormModel(
    formModel: DynamicFormModel
  ): Observable<DynamicFormModel | null> {
    const formModelUpdated$: Subject<DynamicFormModel | null> =
      new BehaviorSubject<DynamicFormModel | null>(null);
    if (!formModel) {
      formModelUpdated$.next(null);
    } else {
      this.addSubscription(
        forkJoin([
          // enable and disable control models
          this.customizeFormModelReadOnlyLogic(formModel),
          // customize translatable titles
          this.customizeFormModelTranslationLogic(formModel),
        ])
          .pipe(take(1))
          .subscribe(([formModelUpdated1, formModelUpdated2]) => {
            formModelUpdated$.next(formModel);
          })
      );
    }
    return formModelUpdated$.asObservable().pipe(take(1));
  }

  protected customizeFormModelReadOnlyLogic(
    formModel: DynamicFormModel
  ): Observable<DynamicFormModel | null> {
    const formModelUpdated$: Subject<DynamicFormModel | null> =
      new BehaviorSubject<DynamicFormModel | null>(null);
    if (!formModel) {
      formModelUpdated$.next(null);
    } else {
      formModel.forEach((controlModel, index: number) => {
        if (controlModel instanceof DynamicFormValueControlModel) {
          if ((controlModel as any).$$_default_disabled === undefined) {
            (controlModel as any).$$_default_disabled = (
              controlModel as any
            ).disabled;
          }
          if ((controlModel as any).$$_default_readonly === undefined) {
            (controlModel as any).$$_default_readonly = (
              controlModel as any
            ).readOnly;
          }
          if (this.markAllAsReadOnly === true) {
            controlModel.disabled = true;
            (controlModel as any).readOnly = true;
          } else {
            controlModel.disabled = (controlModel as any).$$_default_disabled;
            (controlModel as any).readOnly = (
              controlModel as any
            ).$$_default_readonly;
          }
        } else if (controlModel instanceof DynamicFormGroupModel) {
          this.customizeFormModelReadOnlyLogic(
            (controlModel as DynamicFormGroupModel).group
          );
        } else if (controlModel instanceof DynamicFormArrayModel) {
          (controlModel as DynamicFormArrayModel).groups.forEach(
            (group: DynamicFormArrayGroupModel) => {
              this.customizeFormModelReadOnlyLogic(
                (group as DynamicFormArrayGroupModel).group
              );
            }
          );
        }
      });
      formModelUpdated$.next(formModel);
    }
    return formModelUpdated$.asObservable().pipe(take(1));
  }

  protected customizeFormModelTranslationLogic(
    formModel: DynamicFormModel
  ): Observable<DynamicFormModel | null> {
    const formModelUpdated$: Subject<DynamicFormModel | null> =
      new BehaviorSubject<DynamicFormModel | null>(null);
    if (!formModel) {
      formModelUpdated$.next(null);
    } else {
      formModel.forEach((controlModel: DynamicFormControlModel) => {
        if (controlModel instanceof DynamicFormValueControlModel) {
          if ((controlModel?.additional as any)?.translate_label === true) {
            if ((controlModel as any).$$_default_label === undefined) {
              (controlModel as any).$$_default_label = controlModel.label
                ? controlModel.label
                : controlModel.id;
            }
            controlModel.label = this.translation.translate.instant(
              (controlModel as any).$$_default_label
            );
          }
        } else if (controlModel instanceof DynamicFormGroupModel) {
          this.customizeFormModelTranslationLogic(
            (controlModel as DynamicFormGroupModel).group
          );
        } else if (controlModel instanceof DynamicFormArrayModel) {
          (controlModel as DynamicFormArrayModel).groups.forEach(
            (group: DynamicFormArrayGroupModel) => {
              this.customizeFormModelTranslationLogic(
                (group as DynamicFormArrayGroupModel).group
              );
            }
          );
        }
      });
      formModelUpdated$.next(formModel);
    }
    return formModelUpdated$.asObservable().pipe(take(1));
  }

  // ----------------------------------------------------------------

  protected onBlur($event: any): void {
    // this.logger.console.log('onBlur', $event);
    const control: FormControl = $event.control;
    const model: DynamicFormControlModel = $event.model;

    if (
      model instanceof DynamicInputModel &&
      (model?.additional as any)?.onblur_parse_value_to_float_with_fixed !==
        undefined &&
      control.dirty &&
      control.touched
    ) {
      const controlValue = control.value;
      const controlValueParsed = Number.parseFloat(control.value).toFixed(
        Number.parseInt(
          (model?.additional as any)?.onblur_parse_value_to_float_with_fixed
        )
      );

      if ('' + controlValue !== '' + controlValueParsed) {
        control.setValue(controlValueParsed, {
          emitEvent: true,
        });
      }
    }
  }

  protected onChange($event: any): void {
    // this.logger.console.log('onChange', $event);
  }

  protected onFocus($event: any): void {
    // this.logger.console.log('onFocus', $event);
  }

  protected onBsEvent($event: any): void {
    // this.logger.console.log('bsEvent', $event);
  }

  // ----------------------------------------------------------------

  protected getFormModelSimpleControls(
    formModel: DynamicFormControlModel[],
    parentModel: DynamicFormControlModel | null = null,
    parentModelType: 'GROUP' | 'ARRAY' | null = null
  ): DynamicFormControlModel[] {
    const formModelSimpleControls: DynamicFormControlModel[] = [];
    formModel.forEach((control) => {
      (control as any).$$_parent_model = parentModel;
      (control as any).$$_parent_model_type = parentModelType;
      (control as any).$$_parent_model_id = parentModel?.id
        ? parentModel?.id
        : null;
      formModelSimpleControls.push(control);
      if (control instanceof DynamicFormGroupModel) {
        formModelSimpleControls.push(
          ...this.getFormModelSimpleControls(
            (control as DynamicFormGroupModel).group,
            control,
            'GROUP'
          )
        );
      } else if (control instanceof DynamicFormArrayModel) {
        (control as DynamicFormArrayModel).groups
          .filter((group, index) => index === 0)
          .forEach((group: DynamicFormArrayGroupModel) => {
            formModelSimpleControls.push(
              ...this.getFormModelSimpleControls(
                (group as DynamicFormArrayGroupModel).group,
                control,
                'ARRAY'
              )
            );
          });
      } else {
        //
      }
    });

    return formModelSimpleControls;
  }

  protected thereIsSomeModelControlStartTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): boolean {
    return customModelControlsTpl.some(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'START'
    );
  }

  protected getModelControlStartTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): any {
    return customModelControlsTpl.find(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'START'
    );
  }

  protected thereIsSomeModelControlPreEndTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): boolean {
    return customModelControlsTpl.some(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'PRE_END'
    );
  }

  protected getModelControlPreEndTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): any {
    return customModelControlsTpl.find(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'PRE_END'
    );
  }

  protected thereIsSomeModelControlEndTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): boolean {
    return customModelControlsTpl.some(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'END'
    );
  }

  protected getModelControlEndTplWithSameId(
    customModelControlsTpl: any[],
    controlModel: any
  ): any {
    return customModelControlsTpl.find(
      (tpl: any) => tpl.modelId === controlModel.id && tpl.align === 'END'
    );
  }

  protected thereIsSomeModelControlTplWithSameType(
    customModelControlsTpl: any[],
    controlModel: any
  ): boolean {
    return customModelControlsTpl.some(
      (tpl: any) => tpl.modelType === controlModel.type
    );
  }

  protected getModelControlTplWithSameType(
    customModelControlsTpl: any[],
    controlModel: any
  ): any {
    return customModelControlsTpl.find(
      (tpl: any) => tpl.modelType === controlModel.type
    );
  }

  protected getFormControlFromModel(
    form: FormGroup,
    model: DynamicFormControlModel,
    array_index: string | null = null
  ): FormControl {
    let _form = form;
    let _model = model;
    let parents_ids: any[] = [];
    while ((_model as any).$$_parent_model !== null) {
      if ((model as any).$$_parent_model_type === 'ARRAY') {
        parents_ids.push('' + array_index);
      }
      parents_ids.push((model as any).$$_parent_model_id);
      _model = (_model as any).$$_parent_model;
    }
    parents_ids = parents_ids.reverse();
    parents_ids.forEach((pid) => {
      _form = _form?.get(pid) as any;
    });

    const control: FormControl = _form?.get(model.id) as FormControl;

    return control;
  }

  protected hasFormControlErrors(
    form: FormGroup,
    model: DynamicFormControlModel,
    array_index: string | null = null
  ): boolean {
    const control: FormControl = this.getFormControlFromModel(
      form,
      model,
      array_index
    );
    return !!((control?.touched || control?.dirty) && control?.errors);
  }

  protected getControlModelErrorsAsArray(
    form: FormGroup,
    model: DynamicFormControlModel,
    array_index: string | null = null
  ) {
    const control: FormControl = this.getFormControlFromModel(
      form,
      model,
      array_index
    );

    if (!control || !control?.errors) {
      return [];
    }
    const errors = control?.errors;
    const errorsArray: any[] = [];
    if (errors) {
      const keys = Object.keys(errors ? errors : {});
      keys.forEach((key, index) => {
        if (key !== 'bsDate') {
          // bsDate duplicates error
          errorsArray.push({
            code: key,
            customError: errors[key]?.customError,
            customMessage: errors[key]?.customMessage,
            params: Object.assign(model, errors[key]),
          });
        }
      });
    }
    return errorsArray;
  }

  protected removeFormArrayItem(
    formArrayId: string,
    context: DynamicFormArrayModel,
    index: number
  ) {
    const formArrayModel =
      this.dynamicFormService.findModelById<DynamicFormArrayModel>(
        formArrayId,
        this._formModel
      );
    if (formArrayModel) {
      const formArrayControl =
        this.dynamicFormService.findControlByModel<FormArray>(
          formArrayModel,
          this._formGroup
        );
      if (formArrayControl) {
        this.dynamicFormService.removeFormArrayGroup(
          index,
          formArrayControl,
          context
        );
        this.customizeFormGroupUpdateArrayIndex();
        this.formComponentDetectChanges();
      }
    }
  }

  protected insertFormArrayItem(
    formArrayId: string,
    context: DynamicFormArrayModel,
    index: number
  ) {
    const formArrayModel =
      this.dynamicFormService.findModelById<DynamicFormArrayModel>(
        formArrayId,
        this._formModel
      );
    if (formArrayModel) {
      const formArrayControl =
        this.dynamicFormService.findControlByModel<FormArray>(
          formArrayModel,
          this._formGroup
        );
      if (formArrayControl) {
        this.dynamicFormService.insertFormArrayGroup(
          index,
          formArrayControl,
          context
        );
      }
      (formArrayModel as DynamicFormArrayModel).groups.forEach(
        (group: DynamicFormArrayGroupModel) => {
          this.customizeFormModel((group as DynamicFormArrayGroupModel).group);
        }
      );
      this.customizeFormGroupUpdateArrayIndex();
      this.formComponentDetectChanges();
    }
  }

  protected addFormArrayItem(
    formArrayId: string,
    context: DynamicFormArrayModel
  ) {
    const formArrayModel =
      this.dynamicFormService.findModelById<DynamicFormArrayModel>(
        formArrayId,
        this._formModel
      );
    if (formArrayModel) {
      const formArrayControl =
        this.dynamicFormService.findControlByModel<FormArray>(
          formArrayModel,
          this._formGroup
        );
      if (formArrayControl) {
        this.dynamicFormService.addFormArrayGroup(formArrayControl, context);
      }

      (formArrayModel as DynamicFormArrayModel).groups.forEach(
        (group: DynamicFormArrayGroupModel) => {
          this.customizeFormModel((group as DynamicFormArrayGroupModel).group);
        }
      );
      this.customizeFormGroupUpdateArrayIndex();
      this.formComponentDetectChanges();
    }
  }
}
