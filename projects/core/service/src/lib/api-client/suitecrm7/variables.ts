import { InjectionToken } from '@angular/core';

export const CORE_SERVICE_API_CLIENT_SUITECRM7_BASE_PATH =
  new InjectionToken<string>('CORE_SERVICE_API_CLIENT_SUITECRM7_BASE_PATH');

export const COLLECTION_FORMATS = {
  csv: ',',
  tsv: '   ',
  ssv: ' ',
  pipes: '|',
};
