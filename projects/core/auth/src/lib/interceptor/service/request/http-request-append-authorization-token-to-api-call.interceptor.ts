/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngxs/store';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { AuthStoreState } from '../../../store/state/auth-store.state';
import { AUTH_HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN } from '../../variable/variables';

@Injectable()
export class HttpRequestAppendAuthorizationTokenToApiCallInterceptor
  extends AbstractService
  implements HttpInterceptor
{
  private store: Store = inject<Store>(Store);

  private apisPrefixes: string[] = inject<string[]>(
    AUTH_HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN
  );

  constructor() {
    super();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.logger.console.debug(this.__classname, 'intercept', request);

    if (!this.apisPrefixes || this.apisPrefixes.length === 0) {
      return next.handle(request);
    }

    const find = this.apisPrefixes.find(
      (prefix: string) => request.url.indexOf(prefix) !== -1
    );

    const logged: boolean = this.store.selectSnapshot<boolean>(
      AuthStoreState.isLogged
    );

    if (!find || !logged) {
      return next.handle(request);
    }

    this.logger.console.debug(this.__classname, 'find && logged', find, logged);

    // add authorization header in api request with jwt token if available

    if (!request.headers.has('Authorization')) {
      const accessToken: string | null = this.store.selectSnapshot<
        string | null
      >(AuthStoreState.getAccessToken);

      if (!accessToken) {
        return next.handle(request);
      }

      this.logger.console.debug(this.__classname, 'accessToken', accessToken);

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
