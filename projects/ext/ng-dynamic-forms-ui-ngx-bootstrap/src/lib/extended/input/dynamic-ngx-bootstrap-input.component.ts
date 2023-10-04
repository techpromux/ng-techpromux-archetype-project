/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormsCoreModule,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'dynamic-ngx-bootstrap-input',
  templateUrl: './dynamic-ngx-bootstrap-input.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    DynamicFormsCoreModule,
    NgClass,
    NgxMaskDirective,
    NgFor,
    AsyncPipe,
  ],
})
export class DynamicNGxBootstrapInputComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicInputModel;

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
