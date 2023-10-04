/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';

import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { TranslationChangeCurrentLangStoreAction } from '../action/translation-change-current-lang-store.action';
import { TranslationChangeDateFormatStoreAction } from '../action/translation-change-date-format-store.action';
import { TranslationChangeDefaultLangStoreAction } from '../action/translation-change-default-lang-store.action';
import { TranslationChangeTextDirectionInvertedStoreAction } from '../action/translation-change-text-direction-inverted-store.action';
import { TranslationChangeTextDirectionStoreAction } from '../action/translation-change-text-direction-store.action';
import { TranslationStoreModel } from '../model/translation-store.model';
import {
  TRANSLATION_AVAILABLE_LANGUAGES_TOKEN,
  TRANSLATION_STATE_TOKEN,
} from '../variable/variables';

@State<TranslationStoreModel>({
  name: TRANSLATION_STATE_TOKEN,
  defaults: TranslationStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class TranslationStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): TranslationStoreModel {
    return {
      defaultLanguage: 'en',
      currentLanguage: 'en',
      dateFormat: 'YYYY-MM-dd',
      textDirection: 'ltr',
      textDirectionInverted: false,
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [
      'defaultLanguage',
      'currentLanguage',
      'dateFormat',
      'textDirection',
      'textDirectionInverted',
    ].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') +
        'translation' +
        '.' +
        key
    );
  }

  // ----------------------------------------------------------

  protected store: Store = inject<Store>(Store);

  protected availableLanguagesConfig: any[] = inject<any[]>(
    TRANSLATION_AVAILABLE_LANGUAGES_TOKEN
  );

  // ----------------------------------------------------------

  @Selector()
  static getDefaultLanguage(state: TranslationStoreModel): string {
    return state.defaultLanguage;
  }

  @Action(TranslationChangeDefaultLangStoreAction)
  changeDefaultLanguage(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeDefaultLangStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      defaultLanguage: action.lang,
    });
  }

  // ----------------------------------------------------------

  @Selector()
  static getCurrentLanguage(state: TranslationStoreModel): string {
    return state.currentLanguage;
  }

  @Action(TranslationChangeCurrentLangStoreAction)
  changeCurrentLanguage(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeCurrentLangStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      currentLanguage: action.lang,
    });
    this.updateAllDependencies(ctx, action);
  }

  // ----------------------------------------------------------

  @Selector()
  static getDateFormat(state: TranslationStoreModel): string {
    return state.dateFormat;
  }

  @Action(TranslationChangeDateFormatStoreAction)
  changeAppDateFormat(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeDateFormatStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      dateFormat: action.dateFormat,
    });
  }

  // ----------------------------------------------------------

  @Selector()
  static getTextDirection(state: TranslationStoreModel): string {
    return state.textDirection;
  }

  @Action(TranslationChangeTextDirectionStoreAction)
  changeAppTextDirection(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeTextDirectionStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      textDirection: action.textDirection,
    });
  }

  // ----------------------------------------------------------

  @Selector()
  static getTextDirectionInverted(state: TranslationStoreModel): boolean {
    return state.textDirectionInverted;
  }

  @Action(TranslationChangeTextDirectionInvertedStoreAction)
  changeTextDirectionInverted(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeTextDirectionInvertedStoreAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      textDirectionInverted: action.textDirectionInverted,
    });
  }

  // ----------------------------------------------------------

  protected updateAllDependencies(
    ctx: StateContext<TranslationStoreModel>,
    action: TranslationChangeCurrentLangStoreAction
  ): void {
    let currentLanguageConfig = this.availableLanguagesConfig.find(
      (lang) => lang.key === action.lang
    );

    if (!currentLanguageConfig) {
      currentLanguageConfig = this.availableLanguagesConfig.find(
        (lang) => lang.default
      );
    }

    const state = ctx.getState();

    if (currentLanguageConfig) {
      ctx.patchState({
        dateFormat: currentLanguageConfig?.dateFormat,
        textDirection: currentLanguageConfig?.textDirection,
        textDirectionInverted: currentLanguageConfig?.textDirection !== 'ltr',
      });
    }
  }
}
