import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UtilLoggerModule } from '@ng-techpromux-archetype-project/core-util';
import { MenuService } from './service/menu.service';

@NgModule({
  imports: [CommonModule, NgxsModule, UtilLoggerModule],
  providers: [MenuService],
})
export class CoreUiMenuModule {}
