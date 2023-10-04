import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { CoreServiceTranslationModule } from '@ng-techpromux-archetype-project/core-service';
import { DynamicNGxBootstrapFormComponent } from '@ng-techpromux-archetype-project/ext-ng-dynamic-forms-ui-ngx-bootstrap';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DynamicFormsComponent } from './component/dynamic-forms/dynamic-forms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    ButtonModule,
    DynamicNGxBootstrapFormComponent,
    CoreServiceTranslationModule,
    CommonModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [DynamicFormsComponent],
  providers: [],
  exports: [
    DynamicFormsComponent,
    DynamicNGxBootstrapFormComponent,
  ]
})
export class CoreUiDynamicFormsModule {}
