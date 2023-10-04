/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_RATING,
  DYNAMIC_FORM_CONTROL_TYPE_SELECT,
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
  DynamicFormArrayComponent,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormComponentService,
  DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormGroupComponent,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormRelationService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DynamicNGxBootstrapCheckboxGroupComponent } from './checkbox-group/dynamic-ngx-bootstrap-checkbox-group.component';
import { DynamicNGxBootstrapCheckboxComponent } from './checkbox/dynamic-ngx-bootstrap-checkbox.component';
import { DynamicNGxBootstrapDatePickerComponent } from './datepicker/dynamic-ngx-bootstrap-datepicker.component';
import { DynamicNGxBootstrapInputComponent } from './input/dynamic-ngx-bootstrap-input.component';
import { DynamicNGxBootstrapRadioGroupComponent } from './radio-group/dynamic-ngx-bootstrap-radio-group.component';
import { DynamicNGxBootstrapRatingComponent } from './rating/dynamic-ngx-bootstrap-rating.component';
import { DynamicNGxBootstrapSelectComponent } from './select/dynamic-ngx-bootstrap-select.component';
import { DynamicNGxBootstrapTextAreaComponent } from './textarea/dynamic-ngx-bootstrap-textarea.component';
import { DynamicNGxBootstrapTimePickerComponent } from './timepicker/dynamic-ngx-bootstrap-timepicker.component';

@Component({
  selector: 'dynamic-ngx-bootstrap-form-control',
  templateUrl: './dynamic-ngx-bootstrap-form-control-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, NgTemplateOutlet, NgFor],
})
export class DynamicNGxBootstrapFormControlContainerComponent extends DynamicFormControlContainerComponent {
  @ContentChildren(DynamicTemplateDirective)
  override contentTemplateList?: QueryList<DynamicTemplateDirective>;

  @HostBinding('class') override klass?: string;

  @Input() asBootstrapFormGroup = true;
  @Input() override context: DynamicFormArrayGroupModel | null = null;
  @Input() override group!: UntypedFormGroup;
  @Input() override hostClass?: string[];
  // tslint:disable-next-line:no-input-rename
  @Input('templates')
  override inputTemplateList?: QueryList<DynamicTemplateDirective>;
  @Input() override layout?: DynamicFormLayout;
  @Input() override model!: DynamicFormControlModel;

  @Output() override blur: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();
  @Output() override change: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();
  @Output() override focus: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();
  // tslint:disable-next-line:no-output-rename
  @Output('bsEvent')
  override customEvent: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();

  @ViewChild('componentViewContainer', { read: ViewContainerRef, static: true })
  override componentViewContainerRef!: ViewContainerRef;

  get componentType(): Type<DynamicFormControl> | null {
    return (
      this.componentService.getCustomComponentType(this.model) ??
      bootstrapUIFormControlMapFn(this.model)
    );
  }

  constructor(
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override componentFactoryResolver: ComponentFactoryResolver,
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService,
    protected override componentService: DynamicFormComponentService,
    protected override relationService: DynamicFormRelationService
  ) {
    super(
      changeDetectorRef,
      componentFactoryResolver,
      layoutService,
      validationService,
      componentService,
      relationService
    );
  }
}

export function bootstrapUIFormControlMapFn(
  model: DynamicFormControlModel
): Type<DynamicFormControl> | null {
  switch (model.type) {
    case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
      return DynamicNGxBootstrapFormArrayComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
      return DynamicNGxBootstrapCheckboxComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      return DynamicNGxBootstrapCheckboxGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
      return DynamicNGxBootstrapDatePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
      return DynamicNGxBootstrapFormGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
      return DynamicNGxBootstrapInputComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
      return DynamicNGxBootstrapRadioGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RATING:
      return DynamicNGxBootstrapRatingComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
      return DynamicNGxBootstrapSelectComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
      return DynamicNGxBootstrapTextAreaComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
      return DynamicNGxBootstrapTimePickerComponent;

    default:
      return null;
  }
}

@Component({
  selector: 'dynamic-ngx-bootstrap-form-array',
  templateUrl: './dynamic-ngx-bootstrap-form-array.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgFor,
    NgTemplateOutlet,
    DynamicNGxBootstrapFormControlContainerComponent,
  ],
})
export class DynamicNGxBootstrapFormArrayComponent extends DynamicFormArrayComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicFormArrayModel;
  @Input() override templates?: QueryList<DynamicTemplateDirective>;

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override customEvent: EventEmitter<DynamicFormControlCustomEvent> =
    new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  @ViewChildren(DynamicNGxBootstrapFormControlContainerComponent)
  override components!: QueryList<DynamicNGxBootstrapFormControlContainerComponent>;

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}

@Component({
  selector: 'dynamic-ngx-bootstrap-form-group',
  templateUrl: './dynamic-ngx-bootstrap-form-group.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgFor,
    DynamicNGxBootstrapFormControlContainerComponent,
  ],
})
export class DynamicNGxBootstrapFormGroupComponent extends DynamicFormGroupComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicFormGroupModel;
  @Input() override templates?:
    | QueryList<DynamicTemplateDirective>
    | DynamicTemplateDirective[];

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override customEvent: EventEmitter<DynamicFormControlCustomEvent> =
    new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  @ViewChildren(DynamicNGxBootstrapFormControlContainerComponent)
  override components!: QueryList<DynamicNGxBootstrapFormControlContainerComponent>;

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}
