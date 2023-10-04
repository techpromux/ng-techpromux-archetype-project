/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SearchParamsModel {
  // ----------------
  page: number;
  pageSize: number;
  // ----------------
  total?: number;
  // ----------------
  filters?: any;
  // ----------------
  sorts?: any[];
  sortType?: string; // multi, // single
  // ----------------
  items?: any[];
  selected?: any[];
  // ----------------
  groupRows?: boolean;
  groupRowsBy?: string;
}
