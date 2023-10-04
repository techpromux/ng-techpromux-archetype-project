/* eslint-disable @typescript-eslint/no-explicit-any */
import { INavData } from '@coreui/angular';
import { INavDataExtraOptions } from './inav-data-extra-options.model';

export interface INavDataWithExtraOptions extends INavData {
  extraOptions?: INavDataExtraOptions;
}
