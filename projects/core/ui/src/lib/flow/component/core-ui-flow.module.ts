import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CoreUiModalModule } from '../../modal/core-ui-modal.module';
import { MenuFlowStatusComponent } from './menu-flow-status/menu-flow-status.component';

@NgModule({
  imports: [CommonModule, IconModule, NavModule, CoreUiModalModule],
  declarations: [MenuFlowStatusComponent],
  exports: [MenuFlowStatusComponent],
})
export class CoreUiFlowModule {}
