/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicRatingModel,
} from '@ng-dynamic-forms/core';
import { RatingModule } from 'ngx-bootstrap/rating';

@Component({
  selector: 'dynamic-ngx-bootstrap-rating',
  templateUrl: './dynamic-ngx-bootstrap-rating.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RatingModule, NgClass],
})
export class DynamicNGxBootstrapRatingComponent extends DynamicFormControlComponent {
  @Input() override formLayout?: DynamicFormLayout;
  @Input() override group!: UntypedFormGroup;
  @Input() override layout?: DynamicFormControlLayout;
  @Input() override model!: DynamicRatingModel;

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
