/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpResponseInternalServerErrorInterceptor
  extends AbstractService
  implements HttpInterceptor
{
  constructor() {
    super();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 500) {
          this.logger.console.error(
            err.status + ' [' + err.statusText + ']' + ' - ' + err.message
          );
          const error = err.message || err.statusText;
          return throwError(() => new Error(error));
        }
        return next.handle(request);
      })
    );
  }
}
