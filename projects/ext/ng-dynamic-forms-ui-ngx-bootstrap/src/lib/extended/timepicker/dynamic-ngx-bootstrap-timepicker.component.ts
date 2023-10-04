/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTimePickerModel,
} from '@ng-dynamic-forms/core';
import {
  TimepickerComponent,
  TimepickerModule,
} from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'dynamic-ngx-bootstrap-timepicker',
  templateUrl: './dynamic-ngx-bootstrap-timepicker.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, TimepickerModule, NgClass],
})
export class DynamicNGxBootstrapTimePickerComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicTimePickerModel;

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(TimepickerComponent, { static: true })
  bsTimePicker!: TimepickerComponent;

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}
