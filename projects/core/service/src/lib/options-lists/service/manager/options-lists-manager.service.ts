import { OptionsParamsModel } from '../../model/options-params.model';
import { OptionsResponseModel } from '../../model/options-response.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OptionsListsManagerService {
  // -------------------------------------------------

  init(data?: any): Promise<boolean>;

  // -------------------------------------------------

  getOptionsLists(
    keys: string[],
    params?: OptionsParamsModel | null
  ): OptionsResponseModel;

  // -------------------------------------------------
}
