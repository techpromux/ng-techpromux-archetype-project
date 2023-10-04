import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DefaultOptionsListsProviderService } from './service/provider/default-options-lists-provider.service';
import { OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN } from './service/variables';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN,
      useExisting: DefaultOptionsListsProviderService,
      multi: true,
    },
    DefaultOptionsListsProviderService,
  ],
})
export class CoreServiceOptionsListsProviderModule {}
