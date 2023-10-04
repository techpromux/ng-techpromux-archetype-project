import { Observable } from 'rxjs';
import { OptionItemModel } from './option-item.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OptionsListModel {
  key: string;
  fullKey: string;
  options$: Observable<OptionItemModel[]>;
}
