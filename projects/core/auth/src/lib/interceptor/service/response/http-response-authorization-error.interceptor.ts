/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthManagerService } from '../../../manager/service/auth-manager.service';
import { AUTH_MANAGER_SERVICE_TOKEN } from '../../../manager/variable/variables';

@Injectable()
export class HttpResponseAuthorizationErrorInterceptor
  extends AbstractService
  implements HttpInterceptor
{
  private auth: AuthManagerService = inject<AuthManagerService>(
    AUTH_MANAGER_SERVICE_TOKEN
  );

  constructor() {
    super();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this.logger.console.error(
            err.status + ' [' + err.statusText + ']' + ' - ' + err.message
          );
          // logout if 401 or 403 response returned from api
          this.auth
            .logout({})
            .then(() => {
              this.auth.dispatchLogoutSuccessfully();
            })
            .catch((e) => {
              //
            });
          const error = err.message || err.statusText;
          return throwError(() => new Error(error));
        }
        return next.handle(request);
      })
    );
  }
}
