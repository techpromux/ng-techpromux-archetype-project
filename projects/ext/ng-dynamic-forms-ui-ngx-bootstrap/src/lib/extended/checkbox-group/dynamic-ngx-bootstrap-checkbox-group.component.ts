/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicCheckboxGroupModel,
  DynamicCheckboxModel,
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'dynamic-ngx-bootstrap-checkbox-group',
  templateUrl: './dynamic-ngx-bootstrap-checkbox-group.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, ButtonsModule],
})
export class DynamicNGxBootstrapCheckboxGroupComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicCheckboxGroupModel;

  @Output() override blur: EventEmitter<any> = new EventEmitter();
  @Output() override change: EventEmitter<any> = new EventEmitter();
  @Output() override focus: EventEmitter<any> = new EventEmitter();

  constructor(
    protected override layoutService: DynamicFormLayoutService,
    protected override validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  getCheckboxId(model: DynamicCheckboxModel) {
    return this.layoutService.getElementId(model);
  }
}
