/* eslint-disable @typescript-eslint/no-explicit-any */

import { INavDataExtraActionOptions } from './inav-data-extra-action-options.model';
import { INavDataExtraAuthOptions } from './inav-data-extra-auth-options.model';
import { INavDataExtraFlowOptions } from './inav-data-extra-flow-options.model';

export interface INavDataExtraOptions {
  auth?: INavDataExtraAuthOptions;
  action?: INavDataExtraActionOptions;
  flow?: INavDataExtraFlowOptions;
}
