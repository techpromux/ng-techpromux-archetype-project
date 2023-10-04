import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OPTIONS_LISTS_MANAGER_SERVICE_TOKEN } from './service/variables';
import { DefaultOptionsListsManagerService } from './service/manager/default-options-lists-manager.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: OPTIONS_LISTS_MANAGER_SERVICE_TOKEN,
      useExisting: DefaultOptionsListsManagerService,
    },
    DefaultOptionsListsManagerService,
  ],
})
export class CoreServiceOptionsListsManagerModule {}
