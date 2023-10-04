import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertCommandModel } from '../../model/modal-alert-command.model';
import { ModalAlertResultModel } from '../../model/modal-alert-result.model';

@Component({
  selector: 'techpromux-ui-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalConfirmComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  command: ModalAlertCommandModel | null = null;
  result: ModalAlertResultModel | null = null;

  constructor(public changeDetection: ChangeDetectorRef) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  hide(): void {
    this.result = {
      closed: true,
      canceled: false,
      confirmed: false,
      eventName: 'hide',
      eventData: {},
    };
    this.modalRef?.hide();
  }

  confirm(): void {
    this.result = {
      closed: false,
      canceled: false,
      confirmed: true,
      eventName: 'confirm',
      eventData: {},
    };
    this.modalRef?.hide();
  }

  decline(): void {
    this.result = {
      closed: false,
      canceled: true,
      confirmed: false,
      eventName: 'cancel',
      eventData: {},
    };
    this.modalRef?.hide();
  }
}
