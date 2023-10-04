import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { TranslationChangeCurrentLangStoreAction } from '../store/action/translation-change-current-lang-store.action';
import { TranslationChangeDefaultLangStoreAction } from '../store/action/translation-change-default-lang-store.action';

@Injectable()
export class TranslationService extends AbstractService {
  public translate: TranslateService =
    inject<TranslateService>(TranslateService);

  protected store: Store = inject<Store>(Store);

  protected defaultLang!: string;

  protected currentLang!: string;

  private locale: string = inject<string>(LOCALE_ID);

  constructor() {
    super();
  }

  public init(
    defaultLang: string | null = null,
    useLang: string | null = null
  ): void {
    if (defaultLang) {
      this.changeDefaultLang(defaultLang);
      if (!useLang) {
        this.changeCurrentLang(defaultLang);
      }
    }

    if (useLang) {
      this.changeCurrentLang(useLang);
    }
  }

  public use(useLang: string | null = null) {
    this.changeCurrentLang(useLang);
  }

  // -----------------------------------------------------------------

  protected changeDefaultLang(lang: string): void {
    this.translate.setDefaultLang(lang);
    this.onChangedDefaultLang(lang);
  }

  protected changeCurrentLang(lang: string | null): void {
    this.translate.use(lang ? lang : this.defaultLang);
    this.onChangedCurrentLang(lang ? lang : this.defaultLang);
  }

  protected onChangedDefaultLang(lang: string): void {
    if (this.defaultLang !== lang) {
      this.defaultLang = lang;
      this.store.dispatch([
        new TranslationChangeDefaultLangStoreAction(this.defaultLang),
      ]);
    }
  }

  protected onChangedCurrentLang(lang: string): void {
    if (this.currentLang !== lang) {
      this.locale = lang;
      this.currentLang = lang;
      this.store.dispatch([
        new TranslationChangeCurrentLangStoreAction(this.currentLang),
      ]);
    }
  }
}
