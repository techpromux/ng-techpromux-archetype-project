import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { UtilLoggerModule } from '@ng-techpromux-archetype-project/core-util';
import { TranslationService } from './service/translation.service';

@NgModule({
  imports: [CommonModule, NgxsModule, UtilLoggerModule],
  providers: [TranslationService],
  exports: [TranslateModule],
})
export class CoreServiceTranslationModule {}
