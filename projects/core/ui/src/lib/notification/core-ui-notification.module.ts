import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';
import { UiNotificationService } from './service/ui-notification.service';

@NgModule({
  imports: [CommonModule, NotifierModule],
  declarations: [],
  providers: [UiNotificationService],
  exports: [NotifierModule],
})
export class CoreUiNotificationModule {}
