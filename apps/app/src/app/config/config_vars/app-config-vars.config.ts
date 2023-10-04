/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAppConfigVarsModel } from '@apps/app-base-api';
import { DotEnvLoaderService } from '@ng-techpromux-archetype-project/core-util';
import { environment } from '../../../environments/environment';

export const APP_CONFIG_VARS: IAppConfigVarsModel =
  DotEnvLoaderService.getVars<IAppConfigVarsModel>(
    'app',
    environment.name === '' ? 'dev' : environment.name
  );
