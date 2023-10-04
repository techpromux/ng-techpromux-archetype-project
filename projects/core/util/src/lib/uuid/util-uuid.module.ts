import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilUuidService } from './service/util-uuid.service';

@NgModule({
  imports: [CommonModule],
  providers: [UtilUuidService],
})
export class UtilUuidModule {}
