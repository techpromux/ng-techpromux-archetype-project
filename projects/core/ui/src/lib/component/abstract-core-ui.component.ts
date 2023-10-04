/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { TranslationService } from '@ng-techpromux-archetype-project/core-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoaderIndicatorService } from '../loader/service/loader-indicator.service';
import { ModalAlertResultModel } from '../modal/model/modal-alert-result.model';
import { ModalService } from '../modal/service/modal.service';
import { UiNotificationService } from '../notification/service/ui-notification.service';

@Component({
  template: '',
})
export abstract class AbstractCoreUiComponent
  extends AbstractComponent
  implements OnInit, OnDestroy
{
  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  private loader: LoaderIndicatorService = inject<LoaderIndicatorService>(
    LoaderIndicatorService
  );

  private modal: ModalService = inject<ModalService>(ModalService);

  private translation: TranslationService =
    inject<TranslationService>(TranslationService);

  private notifier: UiNotificationService = inject<UiNotificationService>(
    UiNotificationService
  );

  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  private modalRef: BsModalRef | null = null;

  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  private processing$: Map<string, Subject<boolean>> = new Map();

  // -----------------------------------------------------

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.processing$.forEach((value$, key) => {
      value$.next(false);
      value$.complete();
      value$.unsubscribe();
    });
    this.processing$.clear();
  }

  // ------------------------------------------------------

  public get uiModal(): ModalService {
    return this.modal;
  }

  public uiModalOpen(
    template: TemplateRef<any>,
    initialState: any = {},
    onHideFn: ((result: any) => void) | null = null,
    modalOptions: any | null = {}
  ): BsModalRef<any> | null {
    this.modalRef = this.uiModal.openAsModal(
      template,
      initialState,
      onHideFn,
      modalOptions
    );
    return this.modalRef;
  }

  public uiModalClose(): void {
    this.modalRef?.hide();
  }

  public uiModalOpenAlert(
    title: string,
    body: string,
    onHide: ((result: ModalAlertResultModel) => void) | null = null,
    extraOptions: any = {},
    modalOptions: any | null = {}
  ): void {
    this.uiModal.openAlert(title, body, onHide, extraOptions, modalOptions);
  }

  public uiModalOpenConfirm(
    title: string,
    body: string,
    onHide: ((result: ModalAlertResultModel) => void) | null = null,
    extraOptions: any = {},
    modalOptions: any | null = {}
  ): void {
    this.uiModal.openConfirm(title, body, onHide, extraOptions, modalOptions);
  }

  // ------------------------------------------------------

  public uiNotifier(): UiNotificationService {
    return this.notifier;
  }

  // ------------------------------------------------------

  public uiTranslate(): TranslateService {
    return this.translation.translate;
  }
  // ---------------------------------------------------------------------

  private getIdForLoader(processId: string = ''): string {
    return 'loader-process-' + this.__classname + '-' + processId;
  }

  protected startLoader(processId: string = ''): void {
    const pId: string = this.getIdForLoader(processId);
    const pDescription = '[' + this.__classname + ']: ' + processId;

    let process$: Subject<boolean> | null = null;
    if (this.processing$.has(pId)) {
      process$ = this.processing$.get(pId) as Subject<boolean>;
    } else {
      process$ = new BehaviorSubject<boolean>(false);
      this.processing$.set(pId, process$);
    }
    process$.next(true);
    this.loader.waitFor(process$.asObservable(), pDescription);
  }

  protected endLoader(processId: string = ''): void {
    const pId: string = this.getIdForLoader(processId);
    let process$: Subject<boolean> | null = null;
    if (this.processing$.has(pId)) {
      process$ = this.processing$.get(pId) as Subject<boolean>;
      process$?.next(false);
    }
  }

  // ------------------------------------------------------
}
