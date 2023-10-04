import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoggerService } from './service/logger.service';

@NgModule({
  imports: [CommonModule],
  providers: [LoggerService],
})
export class UtilLoggerModule {}
