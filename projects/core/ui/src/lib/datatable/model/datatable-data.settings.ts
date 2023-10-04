/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectionType, SortType } from '@swimlane/ngx-datatable';

export interface DatatableDataSettings {
  items: any[];
  total: number;
  page: number;
  pageSize?: number;
  externalPaging?: boolean;
  externalSorting?: boolean;
  messages?: {
    emptyMessage?: string;
    // Footer total message
    totalMessage?: string;
    // Footer selected message
    selectedMessage?: string;
  };
  rowIdentity?: (row: any) => any;
  selectionType?: SelectionType; // single, cell, multi, multiClick, checkbox,
  selectAllRowsOnPage?: boolean;
  displayCheck?: (row: any, column: string, value: any) => boolean;
  selectCheck?: (row: any, column: string, value: any) => boolean;
  selected?: any[];
  sorts?: any[];
  sortType?: SortType; // multi, // single
  groupRows?: boolean;
  groupRowsBy?: string;
  treeFromRelation?: string;
  treeToRelation?: string;
}
