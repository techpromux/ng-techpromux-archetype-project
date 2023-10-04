import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreAuthManagerModule } from '../manager/core-auth-manager.module';
import { DefaultAuthPermissionGuard } from './service/default-auth-permission.guard';

@NgModule({
  imports: [CommonModule, CoreAuthManagerModule],
  providers: [DefaultAuthPermissionGuard],
})
export class CoreAuthGuardModule {}
