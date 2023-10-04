/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, inject } from '@angular/core';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import {
  AUTH_MANAGER_SERVICE_TOKEN,
  AuthManagerService,
  AuthStoreState,
} from '@ng-techpromux-archetype-project/core-auth';
import {
  FlowService,
  FlowStatusModel,
  FlowStoreState,
} from '@ng-techpromux-archetype-project/core-service';
import { Select } from '@ngxs/store';
import { Observable, take } from 'rxjs';
import { AbstractCoreUiComponent } from '../../../component/abstract-core-ui.component';
import { ModalAlertResultModel } from '../../../modal/model/modal-alert-result.model';

@Component({
  selector: 'techpromux-menu-flow-status',
  templateUrl: './menu-flow-status.component.html',
  styleUrls: ['./menu-flow-status.component.scss'],
})
export class MenuFlowStatusComponent
  extends AbstractCoreUiComponent
  implements OnInit
{
  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  public flow: FlowService = inject<FlowService>(FlowService);

  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  @Select(AuthStoreState.isLogged)
  protected isUserLogged$!: Observable<boolean>;

  @Select(FlowStoreState.getStatus)
  protected currentFlowStatus$!: Observable<FlowStatusModel>;

  // -----------------------------------------------------

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.cdr.detectChanges();
  }

  onClickLogin(): void {
    this.flow.startAction('', '', 'login', null, {}, true).then();
  }

  onClickRefreshToken(): void {
    this.startLoader('Flow-Refresh-Token');
    this.auth.refreshToken().then((result: any) => {
      this.endLoader('Flow-Refresh-Token');
    });
  }

  onClickLogout(): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.logout.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.logout.confirmationBody')
      ),
      (data: ModalAlertResultModel) => {
        if (data.confirmed) {
          setTimeout(() => {
            this.flow.startAction('', '', 'logout', null, {}, true).then();
          });
        }
      }
    );
  }

  onClickHome(): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.home.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.home.confirmationBody')
      ),
      (data: ModalAlertResultModel) => {
        if (data.confirmed) {
          setTimeout(() => {
            this.flow.startAction('', '', '', null, {}, true).then();
          });
        }
      }
    );
  }

  onClickBackwardAction(): void {
    window.dispatchEvent(new Event('flow-back-button-clicked'));
    /*
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.back.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('base.layout.block.menu.flow.back.confirmationBody')
      ),
      (data: ModalAlertResultModel) => {
        if (data.confirmed) {
          setTimeout(() => {
            // this.flow.stepBackward().then();
            window.dispatchEvent(new Event('flow-back-button-clicked'));
          });
        }
      }
    );
    */
  }

  onClickCloseAction(): void {
    this.addSubscription(
      this.currentFlowStatus$.pipe(take(1)).subscribe((currentStatus) => {
        if (
          (currentStatus.isHome || currentStatus.isDashboard) &&
          currentStatus.flowActionQueuePosition === 1
        ) {
          Device.getInfo().then((info) => {
            if (info.platform === 'web') {
              this.onClickLogout();
              return;
            }
            this.uiModalOpenConfirm(
              this.uiTranslate().instant(
                _i18n('base.layout.block.menu.flow.exit.confirmationTitle')
              ),
              this.uiTranslate().instant(
                _i18n('base.layout.block.menu.flow.exit.confirmationBody')
              ),
              (data: ModalAlertResultModel) => {
                if (data.confirmed) {
                  setTimeout(() => {
                    App.exitApp().then((exit) => {
                      this.logger.console.debug(
                        'App',
                        'exitApp() -> fired !!!',
                        exit
                      );
                    });
                  });
                }
              }
            );
            return;
          });
          return;
        }
        this.uiModalOpenConfirm(
          this.uiTranslate().instant(
            _i18n('base.layout.block.menu.flow.close.confirmationTitle')
          ),
          this.uiTranslate().instant(
            _i18n('base.layout.block.menu.flow.close.confirmationBody')
          ),
          (data: ModalAlertResultModel) => {
            if (data.confirmed) {
              setTimeout(() => {
                this.flow.closeCurrentAction().then();
              });
            }
          }
        );
      })
    );
  }
}
