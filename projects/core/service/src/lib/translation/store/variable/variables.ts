/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';
import { StateToken } from '@ngxs/store';
import { TranslationStoreModel } from '../model/translation-store.model';

export const TRANSLATION_STATE_TOKEN = new StateToken<TranslationStoreModel>(
  'translation'
);

export const TRANSLATION_AVAILABLE_LANGUAGES_TOKEN = new InjectionToken<any[]>(
  'TRANSLATION_AVAILABLE_LANGUAGES_TOKEN'
);
