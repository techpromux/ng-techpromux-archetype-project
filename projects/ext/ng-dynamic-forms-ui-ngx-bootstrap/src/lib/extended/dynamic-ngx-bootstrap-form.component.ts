/* eslint-disable @angular-eslint/no-output-native */
import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  DynamicFormComponentService,
  DynamicFormControlEvent,
  DynamicFormLayout,
  DynamicFormModel,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DynamicNGxBootstrapFormControlContainerComponent } from './dynamic-ngx-bootstrap-form-control-container.component';

@Component({
  selector: 'dynamic-ngx-bootstrap-form',
  templateUrl: './dynamic-ngx-bootstrap-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, DynamicNGxBootstrapFormControlContainerComponent],
})
export class DynamicNGxBootstrapFormComponent extends DynamicFormComponent {
  @Input() override group!: UntypedFormGroup;
  @Input() override model!: DynamicFormModel;
  @Input() override layout?: DynamicFormLayout;

  @Output() override blur: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();
  @Output() override change: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();
  @Output() override focus: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();

  @Output() bsEvent: EventEmitter<DynamicFormControlEvent> =
    new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective)
  override templates!: QueryList<DynamicTemplateDirective>;

  @ViewChildren(DynamicNGxBootstrapFormControlContainerComponent)
  override components!: QueryList<DynamicNGxBootstrapFormControlContainerComponent>;

  constructor(
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override componentService: DynamicFormComponentService
  ) {
    super(changeDetectorRef, componentService);
  }
}
