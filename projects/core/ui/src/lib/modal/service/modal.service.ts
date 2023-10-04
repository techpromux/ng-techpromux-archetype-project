/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, TemplateRef, inject } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { ModalAlertComponent } from '../component/modal-alert/modal-alert.component';
import { ModalConfirmComponent } from '../component/modal-confirm/modal-confirm.component';
import { ModalAlertResultModel } from '../model/modal-alert-result.model';

@Injectable()
export class ModalService extends AbstractService {
  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  private modalService: BsModalService = inject<BsModalService>(BsModalService);

  // ----------------------------------------------------------

  constructor() {
    super();
  }

  public openAsModal(
    content: string | TemplateRef<any> | any,
    initialState: any = {},
    onHideFn: ((result: any) => void) | null = null,
    modalOptions: any | null = {}
  ): BsModalRef {
    return this.showComponentOrTemplateAsModal(
      content,
      false,
      initialState,
      modalOptions,
      onHideFn
    );
  }

  public openAlert(
    title: string,
    body: string,
    onHideFn: ((result: ModalAlertResultModel) => void) | null = null,
    extraOptions: any = {},
    modalOptions: any | null = {}
  ): void {
    const initialState = {
      command: {
        title: title,
        body: body,
        extraOptions: extraOptions,
      },
    };
    this.showComponentOrTemplateAsModal(
      ModalAlertComponent,
      true,
      initialState,
      modalOptions,
      onHideFn
    );
  }

  public openConfirm(
    title: string,
    body: string,
    onHideFn: ((result: ModalAlertResultModel) => void) | null = null,
    extraOptions: any = {},
    modalOptions: any | null = {}
  ): void {
    const initialState = {
      command: {
        title: title,
        body: body,
        extraOptions: extraOptions,
      },
    };
    this.showComponentOrTemplateAsModal(
      ModalConfirmComponent,
      true,
      initialState,
      modalOptions,
      onHideFn
    );
  }

  private showComponentOrTemplateAsModal(
    content: string | TemplateRef<any> | any,
    isInternalContent: boolean,
    initialState: any = {},
    modalOptions: any | null = {},
    onHideFn: ((result: ModalAlertResultModel) => void) | null = null
  ): BsModalRef {
    const modalRef: BsModalRef = this.modalService.show(
      content,
      Object.assign<ModalOptions, any, any>(
        {},
        {
          initialState: initialState,
          // id: this.modalRefs.size + 1,
          class: 'modal-dialog modal-dialog-centered',
          animated: true,
          // backdrop: 'static',
          // keyboard: false,
        },
        modalOptions ? modalOptions : {}
      )
    );

    if (isInternalContent) {
      modalRef.content.modalRef = modalRef;
    }

    modalRef.onHide
      ?.asObservable()
      .pipe(take(1))
      .subscribe(($event) => {
        if (isInternalContent) {
          modalRef.content.changeDetection?.markForCheck();
        }
      });

    modalRef.onHidden
      ?.asObservable()
      .pipe(take(1))
      .subscribe(($event) => {
        if (isInternalContent) {
          modalRef.content.changeDetection?.markForCheck();
        }
      });

    modalRef.onHidden?.pipe(take(1)).subscribe(($event) => {
      if (onHideFn && isInternalContent) {
        const result = modalRef.content.result;
        setTimeout(() => {
          onHideFn(
            result
              ? result
              : {
                  closed: false,
                  confirmed: false,
                  canceled: false,
                  eventName: 'onHidden',
                  eventData: {},
                }
          );
        }, 100);
      }
    });

    return modalRef;
  }
}
