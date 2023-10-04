/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { DatatableDataSettings } from '@ng-techpromux-archetype-project/core-ui';
import { Observable, take } from 'rxjs';
import { SearchParamsModel } from '../../../model/search-params.model';
import { AbstractDomainFacadeService } from '../../../service/abstract-domain-facade.service';
import { AbstractFeatureComponent } from '../abstract-feature.component';

@Component({
  template: '',
})
export abstract class AbstractListFeatureComponent
  extends AbstractFeatureComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  protected selected: any[] = [];

  protected searchParams: SearchParamsModel =
    this.getSearchParamsDefaultValue();

  protected pageDataLoaded = false;

  protected pagedData: DatatableDataSettings = this.getPagedDataDefaultValue();

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  protected abstract getDomainFacade(): AbstractDomainFacadeService;

  // ----------------------------------------------------------
  // OBSERVABLES
  // ----------------------------------------------------------

  protected abstract getPagedDataSettings$(): Observable<DatatableDataSettings>;

  // ----------------------------------------------------------

  constructor() {
    super();
  }

  // ----------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();

    this.getDomainFacade().reset();

    this.addSubscription(
      this.getPagedDataSettings$()
        // .pipe(skip(1))
        .subscribe((data: DatatableDataSettings) => {
          this.pagedData = {
            ...this.pagedData,
            ...data,
            ...{ selected: [...this.selected] },
          };
          this.cdr.detectChanges();
        })
    );

    this.listItems({ ...this.searchParams }, true);
  }

  // ----------------------------------------------------------

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ----------------------------------------------------------

  protected abstract getSearchParamsDefaultValue(): SearchParamsModel;

  protected abstract getPagedDataDefaultValue(): DatatableDataSettings;

  // ----------------------------------------------------------

  protected listItems(eventData: any, force: boolean = false): void {
    this.logger.console.debug(
      this.__classname,
      'listItems -> eventData',
      eventData
    );

    this.searchParams = { ...this.searchParams, ...eventData };

    this.logger.console.debug(
      this.__classname,
      'listItems -> searchParams',
      this.searchParams
    );

    this.startLoader('listItems');

    this.pageDataLoaded = false;

    this.addSubscription(
      this.getDomainFacade()
        .listItems(this.searchParams, true)
        .pipe(take(1))
        .subscribe((result) => {
          this.pageDataLoaded = true;
          this.endLoader('listItems');
          this.cdr.detectChanges();
        })
    );
  }

  // ----------------------------------------------------------

  protected onPage($event: any): void {
    this.logger.console.debug(this.__classname, 'onPage', $event);
    this.listItems({ _eventName: 'page', ...$event });
  }

  protected onSort($event: any): void {
    this.logger.console.debug(this.__classname, 'onSort', $event);
    this.listItems({ _eventName: 'sort', ...$event });
  }

  protected onSelect($event: any): void {
    this.logger.console.debug(this.__classname, 'onSelect', $event);
    this.selected = [...$event.selected];
  }

  // ---------------------------------------------------------------------------------
}
