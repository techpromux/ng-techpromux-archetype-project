import { OptionsListModel } from './options-list.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OptionsResponseModel {
  keys: string[];
  language?: string;
  results?: OptionsListModel[];
}
