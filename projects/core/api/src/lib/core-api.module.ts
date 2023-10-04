import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  UtilCodeModule,
  UtilLoggerModule,
} from '@ng-techpromux-archetype-project/core-util';

@NgModule({
  imports: [CommonModule, UtilCodeModule, UtilLoggerModule],
})
export class CoreApiModule {}
