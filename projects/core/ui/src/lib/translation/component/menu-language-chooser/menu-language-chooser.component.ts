/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';

import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import {
  TranslationService,
  TranslationStoreState,
} from '@ng-techpromux-archetype-project/core-service';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuStoreState } from '../../../menu/store/state/menu-store.state';

@Component({
  selector: 'techpromux-menu-language-chooser',
  templateUrl: './menu-language-chooser.component.html',
  styleUrls: ['./menu-language-chooser.component.scss'],
})
export class MenuLanguageChooserComponent
  extends AbstractComponent
  implements OnInit
{
  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  protected translation: TranslationService =
    inject<TranslationService>(TranslationService);

  // -----------------------------------------------------
  // OBSERVABLES
  // -----------------------------------------------------

  @Select(MenuStoreState.getMenuItemsSelector('language-available-options'))
  protected languages$!: Observable<any[]>;

  protected languagesEnabled$ = new BehaviorSubject<any[]>([]);

  @Select(TranslationStoreState.getCurrentLanguage)
  protected currentLanguage$!: Observable<string>;

  // -----------------------------------------------------

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.addSubscription(
      this.languages$.subscribe((langs: any[]) => {
        this.languagesEnabled$.next(langs.filter((item)=> item.enabled));
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      })
    );
  }

  changeCurrentLang(lang: string): void {
    this.translation.use(lang);
  }
}
