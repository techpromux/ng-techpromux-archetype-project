import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, ModalModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalAlertComponent } from './component/modal-alert/modal-alert.component';
import { ModalConfirmComponent } from './component/modal-confirm/modal-confirm.component';
import { ModalService } from './service/modal.service';

@NgModule({
  declarations: [ModalAlertComponent, ModalConfirmComponent],
  providers: [BsModalService, ModalService],
  imports: [
    CommonModule,
    TranslateModule,
    // ------------------------
    ButtonModule,
    IconModule,
    ModalModule,
    // ------------------------
    BsDatepickerModule.forRoot(),
  ],
  exports: [],
})
export class CoreUiModalModule {}
