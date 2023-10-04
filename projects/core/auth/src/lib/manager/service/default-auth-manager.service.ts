/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { AuthStoreState } from '../../store/state/auth-store.state';
import { AbstractAuthManagerService } from './abstract-auth-manager.service';

@Injectable()
export class DefaultAuthManagerService extends AbstractAuthManagerService {
  constructor() {
    super();
  }

  public isLogged(): boolean {
    return this.store.selectSnapshot(AuthStoreState.isLogged);
  }

  public isAdmin(): boolean {
    return this.hasPermission('ROLE_ADMIN');
  }

  public getUserName(): string | null {
    return this.store.selectSnapshot(AuthStoreState.getUserName);
  }

  public getUserRoles(): string[] {
    const userPermissions = this.store.selectSnapshot(
      AuthStoreState.getUserPermissions
    );

    let userRoles = userPermissions?.userRoles
      ? userPermissions?.userRoles
      : [];

    userRoles = [...userRoles].filter(
      (role) => role !== 'IS_AUTHENTICATED' && role !== 'IS_ANONYMOUS'
    );

    const isLogged = this.store.selectSnapshot(AuthStoreState.isLogged);

    if (isLogged && userRoles.indexOf('IS_AUTHENTICATED') === -1) {
      userRoles.push('IS_AUTHENTICATED');
    }

    if (!isLogged && userRoles.indexOf('IS_ANONYMOUS') === -1) {
      userRoles.push('IS_ANONYMOUS');
    }

    return userRoles;
  }

  public hasPermission(role: string): boolean {
    return this.hasPermissions([role], 'and');
  }

  public hasPermissions(roles: string[], operator: string = 'and'): boolean {
    if (roles.length === 0) {
      return true;
    }
    const userRoles = this.getUserRoles();

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    const allRoles = operator === 'and';

    let hasAllRoles = allRoles;

    roles.forEach((role) => {
      if (allRoles) {
        hasAllRoles =
          hasAllRoles && userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      } else {
        hasAllRoles =
          hasAllRoles || userRoles.indexOf(role.toLocaleUpperCase()) !== -1;
      }
    });

    return hasAllRoles;
  }
}
