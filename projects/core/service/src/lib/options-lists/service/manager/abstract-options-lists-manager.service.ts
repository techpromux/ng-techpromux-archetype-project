/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { BehaviorSubject, Subject, filter, skip, take } from 'rxjs';
import { TranslationStoreState } from '../../../translation/store/state/translation-store.state';
import { OptionItemModel } from '../../model/option-item.model';
import { OptionsParamsModel } from '../../model/options-params.model';
import { OptionsResponseModel } from '../../model/options-response.model';
import { OptionsListsLoadedOptionsStoreAction } from '../../store/action/options-lists-loaded-options-store.action';
import { OptionsListsStoreState } from '../../store/state/options-lists-store.state';
import { OptionsListsProviderService } from '../provider/options-lists-provider.service';
import { OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN } from '../variables';
import { OptionsListsManagerService } from './options-lists-manager.service';

export abstract class AbstractOptionsListsManagerService
  extends AbstractService
  implements OptionsListsManagerService
{
  // -------------------------------------------------

  private providersByIds: Map<string, OptionsListsProviderService> = new Map<
    string,
    OptionsListsProviderService
  >();

  private supportedKeysByProviders: Map<string, string> = new Map<
    string,
    string
  >();

  // -------------------------------------------------

  protected store: Store = inject<Store>(Store);

  private actions$: Actions = inject<Actions>(Actions);

  protected providers: OptionsListsProviderService[] = inject<
    OptionsListsProviderService[]
  >(OPTIONS_LISTS_PROVIDER_SERVICE_TOKEN, {
    optional: false,
  });

  // -------------------------------------------------

  constructor() {
    super();
  }

  // -------------------------------------------------

  public init(data?: any): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'init', data);

    this.providers.forEach((provider: OptionsListsProviderService) => {
      provider.setOptionsListManagerService(this);

      const providerId: string = provider.getProviderId();

      if (this.providersByIds.has(providerId)) {
        const error =
          'Options-lists Provider Id [' + providerId + '] already exists!!!';
        this.logger.console.error(this.__classname, error);
        throw error;
      }

      this.providersByIds.set(providerId, provider);

      const supportedKeys: string[] = provider.getSupportedOptionsListsKeys();

      supportedKeys.forEach((key) => {
        if (this.supportedKeysByProviders.has(key)) {
          const error =
            'Options-lists Key [' +
            key +
            '] already supported by another provider!!!';
          this.logger.console.error(this.__classname, error);
          throw error;
        }

        this.supportedKeysByProviders.set(key, providerId);
      });
    });

    return Promise.resolve(true);
  }

  // -------------------------------------------------

  getOptionsLists(
    keys: string[],
    params?: OptionsParamsModel | null
  ): OptionsResponseModel {
    this.logger.console.debug(
      this.__classname,
      'getOptionsLists',
      keys,
      params
    );

    keys.forEach((key) => {
      const keyAndParts = (key + '__').split('__');
      if (
        !this.supportedKeysByProviders.has(keyAndParts[0]) &&
        !this.supportedKeysByProviders.has('*')
      ) {
        const error =
          'Options-lists Key [' +
          keyAndParts[0] +
          '] is not supported by any provider!!!';
        this.logger.console.error(this.__classname, error);
        throw error;
      }
    });

    const requestedKeys: Map<string, boolean> = new Map<string, boolean>();

    keys.forEach((key) => {
      if (requestedKeys.has(key)) {
        const error = 'Options-lists Key [' + key + '] is already repeated!!!';
        this.logger.console.error(this.__classname, error);
        throw error;
      }
      requestedKeys.set(key, true);
    });

    const currentLanguage = this.store.selectSnapshot(
      TranslationStoreState.getCurrentLanguage
    );

    this.logger.console.debug(
      this.__classname,
      'currentLanguage',
      currentLanguage
    );

    const allLoadedKeys = this.store.selectSnapshot(
      OptionsListsStoreState.getLoadedKeys
    );

    const loadedRequestedKeys: string[] = [];
    const missingRequestedKeys: string[] = [];

    keys.forEach((key) => {
      const fullKeyPath = currentLanguage + '__' + key;
      const exists = !!allLoadedKeys[fullKeyPath];
      if (exists) {
        loadedRequestedKeys.push(key);
      } else {
        missingRequestedKeys.push(key);
      }
    });

    this.logger.console.debug(
      this.__classname,
      'loadedRequestedKeys',
      loadedRequestedKeys
    );

    this.logger.console.debug(
      this.__classname,
      'missingRequestedKeys',
      missingRequestedKeys
    );

    const missingRequestedKeysMapByProviderId: Map<string, string[]> = new Map<
      string,
      string[]
    >();

    missingRequestedKeys.forEach((key) => {
      const keyAndParts = (key + '__').split('__');
      const providerId = this.supportedKeysByProviders.get(keyAndParts[0]);
      let providerKeys: string[] | undefined = [];
      if (providerId) {
        if (missingRequestedKeysMapByProviderId.has(providerId)) {
          providerKeys = missingRequestedKeysMapByProviderId.get(providerId);
        } else {
          providerKeys = [];
          missingRequestedKeysMapByProviderId.set(providerId, providerKeys);
        }
        providerKeys?.push(key);
      }
    });

    this.logger.console.debug(
      this.__classname,
      'missingRequestedKeysMapByProviderId',
      missingRequestedKeysMapByProviderId
    );

    const result: OptionsResponseModel = {
      keys: [...keys],
      language: currentLanguage as string,
      results: [],
    };

    const optionsSubjectsMap: Map<string, Subject<OptionItemModel[]>> = new Map<
      string,
      Subject<OptionItemModel[]>
    >();

    keys.forEach((key) => {
      const subject = new BehaviorSubject<OptionItemModel[]>([]);
      optionsSubjectsMap.set(key, subject);
      const keyAndParts = (key + '__').split('__');

      const missing = missingRequestedKeys.find((k) => k === key);
      result.results?.push({
        key: keyAndParts[0],
        fullKey: key,
        options$: !missing ? subject.asObservable() : subject.pipe(skip(1)),
      });
    });

    this.logger.console.debug(
      this.__classname,
      'optionsSubjectsMap',
      optionsSubjectsMap
    );

    this.logger.console.debug(this.__classname, 'result', result);

    loadedRequestedKeys.forEach((key) => {
      const fullKeyPath = currentLanguage + '__' + key;
      this.logger.console.debug(
        this.__classname,
        'loading options list for key',
        key,
        fullKeyPath
      );
      const loadedOptionsList: OptionItemModel[] = this.store.selectSnapshot(
        OptionsListsStoreState.getOptionsList(fullKeyPath)
      );
      this.logger.console.debug(
        this.__classname,
        'loadedOptionsList',
        loadedOptionsList
      );
      optionsSubjectsMap
        .get(key)
        ?.next(this.getOrderedOptionsList(loadedOptionsList, params));
    });

    missingRequestedKeys.forEach((key) => {
      const fullKeyPath = currentLanguage + '__' + key;

      this.actions$
        .pipe(
          ofActionDispatched(OptionsListsLoadedOptionsStoreAction),
          filter(
            (action: OptionsListsLoadedOptionsStoreAction) =>
              action.key === fullKeyPath
          ),
          take(1)
        )
        .subscribe((action: OptionsListsLoadedOptionsStoreAction) => {
          this.logger.console.debug(
            this.__classname,
            'loading options list for key',
            key,
            fullKeyPath
          );
          const loadedOptionsList: OptionItemModel[] =
            this.store.selectSnapshot(
              OptionsListsStoreState.getOptionsList(fullKeyPath)
            );
          this.logger.console.debug(
            this.__classname,
            'loadedOptionsList',
            loadedOptionsList
          );
          optionsSubjectsMap
            .get(key)
            ?.next(this.getOrderedOptionsList(loadedOptionsList, params));
        });
    });

    setTimeout(() => {
      missingRequestedKeysMapByProviderId.forEach(
        (
          missingKeys: string[],
          providerId: string /*, map: Map<string, string[]>*/
        ) => {
          this.logger.console.debug(
            this.__classname,
            'provider & keys',
            providerId,
            missingKeys
          );
          const provider: OptionsListsProviderService | undefined =
            this.providersByIds.get(providerId);
          provider
            ?.loadOptionsLists(missingKeys, currentLanguage as string)
            .then(() => {
              //
            });
        }
      );
    }, 100);

    return result;
  }

  protected getOrderedOptionsList(
    options: OptionItemModel[],
    params?: OptionsParamsModel | null
  ): OptionItemModel[] {
    const ordered = [...options];
    // ---------------------------------------------------------
    if (params?.orderByLabel) {
      ordered.sort(function (a, b) {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    else if (params?.orderByLabelAlphabetical) {
      ordered.sort(function (a, b) {
        if (
          a?.label?.normalize('NFD')?.toLowerCase() >
          b?.label?.normalize('NFD')?.toLowerCase()
        ) {
          return 1;
        }
        if (
          a?.label?.normalize('NFD')?.toLowerCase() <
          b?.label?.normalize('NFD')?.toLowerCase()
        ) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    else if (params?.orderByLabelNumeric) {
      ordered.sort(function (a, b) {
        if (Number.parseFloat(a?.label) > Number.parseFloat(b?.label)) {
          return 1;
        }
        if (Number.parseFloat(a?.label) < Number.parseFloat(b?.label)) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    else if (params?.orderByValue) {
      ordered.sort(function (a, b) {
        if (a?.value > b?.value) {
          return 1;
        }
        if (a?.value < b?.value) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    else if (params?.orderByValueAlphabetical) {
      ordered.sort(function (a, b) {
        if (
          a?.value?.normalize('NFD')?.toLowerCase() >
          b?.value?.normalize('NFD')?.toLowerCase()
        ) {
          return 1;
        }
        if (
          a?.value?.normalize('NFD')?.toLowerCase() <
          b?.value?.normalize('NFD')?.toLowerCase()
        ) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    else if (params?.orderByValueNumeric) {
      ordered.sort(function (a, b) {
        if (Number.parseFloat(a?.value) > Number.parseFloat(b?.value)) {
          return 1;
        }
        if (Number.parseFloat(a?.value) < Number.parseFloat(b?.value)) {
          return -1;
        }
        return 0;
      });
    }
    // ---------------------------------------------------------
    return ordered;
  }
}
