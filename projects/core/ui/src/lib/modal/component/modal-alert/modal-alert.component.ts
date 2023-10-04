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
  selector: 'techpromux-ui-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAlertComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  command: ModalAlertCommandModel | null = null;
  result: ModalAlertResultModel | null = null;

  constructor(public changeDetection: ChangeDetectorRef) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method,@typescript-eslint/no-empty-function
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

  close(): void {
    this.result = {
      closed: true,
      canceled: false,
      confirmed: false,
      eventName: 'hide',
      eventData: {},
    };
    this.modalRef?.hide();
  }
}
