/* eslint-disable @typescript-eslint/no-explicit-any */
import {PipeTransform, TemplateRef} from '@angular/core';

export interface DataTableOneColumnSetting {
  name?: string;
  nameTranslation?: boolean;
  prop?: string;
  width?: number;
  resizeable?: boolean;
  sortable?: boolean;
  comparator?: (valueA: any, valueB: any, rowA: any, rowB: any, sortDirection: string) => -1 | 0 | 1;
  draggable?: boolean;
  canAutoResize?: boolean;
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  checkboxable?: boolean;
  headerCheckboxable?: boolean;
  headerCheckboxableUseDefaultTemplates?: boolean;
  flexGrow?: number;
  headerClass?: string;
  cellClass?: string;
  frozenLeft?: boolean;
  frozenRight?: boolean;
  pipe?: PipeTransform;
  isTreeColumn?: boolean;
  treeLevelIndent?: number;
}

export interface DatatableColumnsSettings {
  columns: DataTableOneColumnSetting[];
}
