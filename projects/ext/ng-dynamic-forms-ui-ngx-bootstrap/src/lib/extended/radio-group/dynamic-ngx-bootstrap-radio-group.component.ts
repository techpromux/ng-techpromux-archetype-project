/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicRadioGroupModel,
} from '@ng-dynamic-forms/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'dynamic-ngx-bootstrap-radio-group',
  templateUrl: './dynamic-ngx-bootstrap-radio-group.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonsModule, NgClass, NgFor, AsyncPipe],
})
export class DynamicNGxBootstrapRadioGroupComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicRadioGroupModel<string>;

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}
