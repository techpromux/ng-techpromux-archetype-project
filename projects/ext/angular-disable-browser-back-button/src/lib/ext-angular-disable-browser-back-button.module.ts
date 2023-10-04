/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonDisableModule } from './extended/public_api';
import { NGXLogger } from 'ngx-logger';

@NgModule({
  imports: [
    CommonModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true,
    }),
  ],
  exports: [CommonModule],
})
export class ExtAngularDisableBrowserBackButtonModule {
  private readonly __logger: NGXLogger = inject<NGXLogger>(NGXLogger);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ExtAngularDisableBrowserBackButtonModule
  ) {
    if (parentModule) {
      throw new Error(
        'ExtAngularDisableBrowserBackButtonModule is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.__logger.debug('ExtAngularDisableBrowserBackButtonModule', 'init');

    window.addEventListener('popstate', ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      this.__logger.debug(
        'AppFlowConfigModule',
        'Window -> popstate event fired!!!'
      );
      if ((window as any)._popstateEventListenerBlocked === true) {
        this.__logger.debug(
          'AppFlowConfigModule',
          'Window -> popstate event blocked!!!'
        );
      } else {
        this.__logger.debug(
          'AppFlowConfigModule',
          'Window -> popstate event not blocked !!!'
        );
      }
    });
  }
}
