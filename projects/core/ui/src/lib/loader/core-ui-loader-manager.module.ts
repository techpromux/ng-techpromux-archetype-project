import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  UtilLoggerModule,
  UtilUuidModule,
} from '@ng-techpromux-archetype-project/core-util';
import { LoaderIndicatorService } from './service/loader-indicator.service';

@NgModule({
  imports: [CommonModule, NgxsModule, UtilLoggerModule, UtilUuidModule],
  providers: [LoaderIndicatorService],
})
export class CoreUiLoaderModule {}
