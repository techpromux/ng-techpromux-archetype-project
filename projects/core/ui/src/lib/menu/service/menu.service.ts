/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';

import { Store } from '@ngxs/store';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { MenuSetItemStoreAction } from '../store/action/menu-set-item-store.action';

export class MenuService extends AbstractService {
  private store: Store = inject<Store>(Store);

  constructor() {
    super();
  }

  public addMenuOptions(id: string, options: any): void {
    this.store.dispatch(new MenuSetItemStoreAction(id, options));
  }
}
