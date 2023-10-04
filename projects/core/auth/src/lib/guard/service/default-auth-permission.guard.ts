/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { AuthManagerService } from '../../manager/service/auth-manager.service';
import { AUTH_MANAGER_SERVICE_TOKEN } from '../../manager/variable/variables';

export function checkIsAllowed(
  permissions: string[] = [],
  aggregator = 'and',
  guard: DefaultAuthPermissionGuard = inject<DefaultAuthPermissionGuard>(
    DefaultAuthPermissionGuard
  )
): boolean {
  return guard.isAllowed(permissions, aggregator);
}

@Injectable()
export class DefaultAuthPermissionGuard extends AbstractService {
  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  constructor() {
    super();
  }

  public isAllowed(permissions: string[] = [], aggregator = 'and'): boolean {
    if (permissions.length === 0) {
      return true;
    }
    return this.auth.hasPermissions(permissions, aggregator);
  }
}
