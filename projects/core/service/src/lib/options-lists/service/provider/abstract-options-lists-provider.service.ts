/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { OptionItemModel } from '../../model/option-item.model';
import { OptionsListsSaveOptionsStoreAction } from '../../store/action/options-lists-save-options-store.action';
import { OptionsListsProviderService } from './options-lists-provider.service';
import { OptionsListsManagerService } from '../manager/options-lists-manager.service';

export abstract class AbstractOptionsListsProviderService
  extends AbstractService
  implements OptionsListsProviderService
{
  protected store: Store = inject<Store>(Store);

  protected defaultManager!: OptionsListsManagerService;

  constructor() {
    super();
  }

  // -------------------------------------------------

  public init(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'init', data);

    return Promise.resolve(true);
  }

  // -------------------------------------------------

  setOptionsListManagerService(manager: OptionsListsManagerService): void {
    this.logger.console.debug(
      this.__classname,
      'setOptionsListManagerService',
      manager
    );
    this.defaultManager = manager;
  }

  // -------------------------------------------------

  public abstract getProviderId(): string;

  // -------------------------------------------------

  public abstract getSupportedOptionsListsKeys(): string[];

  // -------------------------------------------------

  public abstract loadOptionsLists(
    keys: string[],
    lang: string
  ): Promise<boolean>;

  // -------------------------------------------------

  protected saveOptionsList(
    key: string,
    options: OptionItemModel[],
    lang: string
  ): Promise<boolean> {
    this.store.dispatch(
      new OptionsListsSaveOptionsStoreAction(key, options, lang)
    );
    return Promise.resolve(true);
  }

  // -------------------------------------------------
}
