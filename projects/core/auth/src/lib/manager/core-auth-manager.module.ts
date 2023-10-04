/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UtilLoggerModule } from '@ng-techpromux-archetype-project/core-util';
import { DefaultAuthManagerService } from './service/default-auth-manager.service';
import {
  AUTH_MANAGER_DEFAULT_CONFIG_TOKEN,
  AUTH_MANAGER_SERVICE_TOKEN,
} from './variable/variables';

@NgModule({
  imports: [CommonModule, NgxsModule, UtilLoggerModule],
  providers: [
    {
      provide: AUTH_MANAGER_SERVICE_TOKEN,
      useExisting: DefaultAuthManagerService,
    },
    DefaultAuthManagerService,
  ],
})
export class CoreAuthManagerModule {
  private auth: DefaultAuthManagerService = inject<DefaultAuthManagerService>(
    DefaultAuthManagerService
  );

  private authDefaultConfig: any = inject<any>(
    AUTH_MANAGER_DEFAULT_CONFIG_TOKEN
  );

  constructor() {
    this.init();
  }

  private init(): void {
    this.auth.init(this.authDefaultConfig);
  }
}
