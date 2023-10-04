/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN } from '../variable/variables';

@Injectable()
export class HttpRequestAppendHeadersToApiCallInterceptor
  extends AbstractService
  implements HttpInterceptor
{
  private apisPrefixes: string[] = inject<string[]>(
    HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN
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

    if (!find) {
      return next.handle(request);
    }

    this.logger.console.debug(this.__classname, 'find', find);

    if (
      !request.headers.has('Content-Type') &&
      !request.headers.has('enctype')
    ) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!request.headers.has('Access-Control-Allow-Origin')) {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return next.handle(request);
  }
}
