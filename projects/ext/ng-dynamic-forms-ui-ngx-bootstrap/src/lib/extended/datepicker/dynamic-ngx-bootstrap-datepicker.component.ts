/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicDatePickerModel,
  DynamicFormControlComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import {
  BsDatepickerDirective,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'dynamic-ngx-bootstrap-datepicker',
  templateUrl: './dynamic-ngx-bootstrap-datepicker.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, BsDatepickerModule, NgClass, NgIf],
})
export class DynamicNGxBootstrapDatePickerComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicDatePickerModel;

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override customEvent: EventEmitter<DynamicFormControlCustomEvent> =
    new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(BsDatepickerDirective, { static: true })
  bsDatePicker!: BsDatepickerDirective;

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}
