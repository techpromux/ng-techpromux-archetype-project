import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlowService } from './service/flow.service';

@NgModule({
  imports: [CommonModule],
  providers: [FlowService],
})
export class CoreServiceFlowModule {}
