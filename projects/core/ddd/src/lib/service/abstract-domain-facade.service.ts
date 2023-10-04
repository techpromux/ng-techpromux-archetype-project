/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';

import {
  catchError,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { SearchParamsModel } from '../model/search-params.model';
import { AbstractFacadeService } from './abstract-facade.service';

@Injectable()
export abstract class AbstractDomainFacadeService extends AbstractFacadeService {
  // ----------------------------------------------------------------

  public listItems(
    params: SearchParamsModel,
    force?: boolean
  ): Observable<any> {
    this.logger.console.debug(this.__classname, 'listItems', params);

    const paginationParams: SearchParamsModel = Object.assign({}, params, {
      items: [],
      selected: [],
    });

    this.logger.console.debug(
      this.__classname,
      'listItems -> paginationParams',
      paginationParams
    );

    const result$: Subject<any> = new Subject();

    of(force)
      .pipe(
        tap((force) => {
          if (!force) {
            result$.complete();
          }
        }),
        filter((forced) => forced === true),
        switchMap(() => {
          return this.executeListItemsRequest(paginationParams).pipe(take(1));
        }),
        switchMap((response) => {
          this.logger.console.debug(
            this.__classname,
            'listItems -> response ',
            response
          );
          return this.createListDataFromListResponse(
            response,
            paginationParams
          );
        }),
        catchError((err) => {
          this.logger.console.error(this.__classname, 'listItems -> err', err);
          result$.next(null);
          result$.complete();
          throw err;
        })
      )
      .subscribe(
        (pagedData: any) => {
          this.logger.console.debug(
            this.__classname,
            'listItems -> pagedData',
            pagedData
          );
          this.dispatchSetListData(pagedData);
          result$.next(pagedData);
          result$.complete();
        },
        (error: any) => {
          result$.next(null);
          result$.complete();
        }
      );

    return result$.asObservable();
  }

  public saveItem(id: string | null, itemData: any): Observable<any> {
    this.logger.console.debug(
      this.__classname,
      'saveItem -> id, itemData',
      id,
      itemData
    );

    const result$: Subject<any> = new Subject();

    this.getBodyDataForSaveItem(id, itemData)
      .pipe(
        take(1),
        tap((bodyData) => {
          this.logger.console.debug(
            this.__classname,
            'saveItem -> bodyData',
            bodyData
          );
        }),
        switchMap((bodyData) => {
          return this.executeSaveItemRequest(id, itemData, bodyData).pipe(
            take(1)
          );
        }),
        catchError((err) => {
          this.logger.console.error(this.__classname, 'saveItem -> err', err);
          result$.next(null);
          result$.complete();
          throw err;
        })
      )
      .subscribe(
        (response) => {
          this.logger.console.debug(
            this.__classname,
            'saveItem -> response ',
            response
          );
          // return result
          const item$ = this.createItemDataFromSaveResponseData(response.data);
          item$.pipe(take(1)).subscribe((item) => {
            result$.next(item);
            result$.complete();
          });
        },
        (error: any) => {
          result$.next(null);
          result$.complete();
        }
      );

    return result$.asObservable();
  }

  public removeItem(id: string | null, extraData: any): Observable<any> {
    this.logger.console.debug(
      this.__classname,
      'removeItem -> id, extraData',
      id,
      extraData
    );

    const result$: Subject<any> = new Subject();

    this.getBodyDataForRemoveItem(id, extraData)
      .pipe(
        take(1),
        tap((bodyData) => {
          this.logger.console.debug(
            this.__classname,
            'removeItem -> bodyData',
            bodyData
          );
        }),
        switchMap((bodyData) => {
          return this.executeRemoveItemRequest(id, extraData, bodyData).pipe(
            take(1)
          );
        }),
        catchError((err) => {
          this.logger.console.error(this.__classname, 'removeItem -> err', err);
          result$.next(null);
          result$.complete();
          throw err;
        })
      )
      .subscribe(
        (response) => {
          this.logger.console.debug(
            this.__classname,
            'removeItem -> response ',
            response
          );
          // return result
          const item$ = this.createItemDataFromRemoveResponseData(
            response.data
          );
          item$.pipe(take(1)).subscribe((item) => {
            result$.next(item);
            result$.complete();
          });
        },
        (error: any) => {
          result$.next(null);
          result$.complete();
        }
      );

    return result$.asObservable();
  }

  // ----------------------------------------------------------------

  protected abstract dispatchSetListData(pagedData: any): Observable<any>;

  public abstract dispatchClearListData(): Observable<any>;

  // ----------------------------------------------------------------

  protected abstract executeListItemsRequest(
    paginationParams: SearchParamsModel
  ): Observable<any>;

  protected abstract createListDataFromListResponse(
    response: any,
    paginationParams: SearchParamsModel
  ): Observable<any>;

  // ----------------------------------------------------------------

  protected abstract getBodyDataForSaveItem(
    id: string | null,
    itemData: any
  ): Observable<any>;

  protected abstract executeSaveItemRequest(
    id: string | null,
    itemData: any,
    bodyData: any
  ): Observable<any>;

  protected abstract createItemDataFromSaveResponseData(
    response: any
  ): Observable<any>;

  // ----------------------------------------------------------------

  protected abstract getBodyDataForRemoveItem(
    id: string | null,
    extraData: any
  ): Observable<any>;

  protected abstract executeRemoveItemRequest(
    id: string | null,
    extraData: any,
    bodyData: any
  ): Observable<any>;

  protected abstract createItemDataFromRemoveResponseData(
    response: any
  ): Observable<any>;

  // ----------------------------------------------------------------
}
