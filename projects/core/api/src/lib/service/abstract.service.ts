/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoggerService } from '@ng-techpromux-archetype-project/core-util';
import { Observable, throwError } from 'rxjs';

export abstract class AbstractService {
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  protected readonly __classname: string;

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  protected readonly logger: LoggerService =
    inject<LoggerService>(LoggerService);

  // ----------------------------------------------------------

  constructor() {
    this.__classname = this.constructor.name;
  }

  // ----------------------------------------------------------

  protected handleError(err: HttpErrorResponse): Observable<any> {
    const errMsg =
      '[' +
      err?.statusText +
      '] - ' +
      err?.error?.message +
      ': ' +
      (err['error'] || JSON.stringify(err));
    return throwError(() => new Error(errMsg));
  }
}
