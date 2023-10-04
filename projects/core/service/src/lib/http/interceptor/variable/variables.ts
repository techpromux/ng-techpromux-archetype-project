/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core';

export const HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN = new InjectionToken<
  string[]
>('HTTP_INTERCEPTOR_APIS_PREFIXES_CONFIG_TOKEN');
