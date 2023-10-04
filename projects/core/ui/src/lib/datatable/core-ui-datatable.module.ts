import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DefaultDatatableComponent } from './component/default-datatable/default-datatable.component';
import { DatatableSettingsHandler } from './handler/datatable-settings.handler';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    NgxDatatableModule,
  ],
  declarations: [DefaultDatatableComponent],
  providers: [DatatableSettingsHandler],
  exports: [DefaultDatatableComponent],
})
export class CoreUiDatatableModule {}
