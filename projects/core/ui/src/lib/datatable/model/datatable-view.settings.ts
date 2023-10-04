/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateRef } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

export interface DatatableViewSettings {
  columnMode: ColumnMode; // standard, force, flex,
  loadingIndicator: boolean;
  /*
  cssLtrClasses: {
    sortAscending: string;
    sortDescending: string;
    pagerLeftArrow: string;
    pagerRightArrow: string;
    pagerPrevious: string;
    pagerNext: string;
  };
  cssRtlClasses: {
    sortAscending: string;
    sortDescending: string;
    pagerLeftArrow: string;
    pagerRightArrow: string;
    pagerPrevious: string;
    pagerNext: string;
  };
  */
  rowClass: (row: any) => any;
  headerHeight: number;
  rowHeight: number | 'auto' | ((row?: any) => number); // 45
  rowDetailsTemplate?: TemplateRef<any>;
  groupExpansionDefault?: boolean;
  groupRowsHeaderTemplate?: TemplateRef<any>;
  groupRowsHeaderHeight?: number;
  footerHide?: boolean;
  footerShowCustomTemplate?: boolean;
  footerHeight?: number;
  footerMobileHeight?: number;
  footerTabletHeight?: number;
  footerDesktopHeight?: number;
  footerPagingPageSizeOptions: number[];

  reorderable: boolean;
  swapColumns: boolean;
  scrollbarH: boolean;
  scrollbarV: boolean;
  virtualization: boolean;
  toggleRowDetailByWindowSize: boolean;
  tableClasses?: string;
  tableStyles?: any;
  wrapperClasses?: string;
  wrapperStyles?: any;
}
