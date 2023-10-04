/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import {
  DatatableColumnsSettings,
  DataTableOneColumnSetting,
} from '../model/datatable-columns.settings';
import { DatatableDataSettings } from '../model/datatable-data.settings';
import { DatatableViewSettings } from '../model/datatable-view.settings';

@Injectable()
export class DatatableSettingsHandler extends AbstractService {
  protected initiated = false;

  protected reseted = false;

  protected lastOptions: any = {};

  public dataSettings!: DatatableDataSettings;

  public columnsSettings!: DatatableColumnsSettings;

  public viewSettings!: DatatableViewSettings;

  public extraSettings!: any;

  public constructor() {
    super();
  }

  public init(options: any = {}): void {
    this.reset(options);
    this.initiated = true;
  }

  public reset(options: any = {}): void {
    this.lastOptions = options;
    this.dataSettings = this.getDefaultDataSettings(options);
    this.columnsSettings = this.getDefaultColumnsSettings(options);
    this.viewSettings = this.getDefaultViewSettings(options);
    this.extraSettings = this.getDefaultExtraSettings(options);
    this.reseted = true;
  }

  public hasBeenReset(): boolean {
    return this.reseted;
  }

  protected getDefaultDataSettings(options: any = {}): DatatableDataSettings {
    return {
      items: [] as any[],
      total: 0,
      page: 0,
      pageSize: 5,
      externalPaging: true,
      externalSorting: true,
      messages: {
        // Message to show when array is presented
        // but contains no values
        emptyMessage: 'No data to display.',
        // Footer total message
        totalMessage: 'total',
        // Footer selected message
        selectedMessage: 'selected',
      },
      rowIdentity: (row: any) => {
        return row.id;
      },
      selectionType: SelectionType.checkbox, // single, cell, multi, multiClick, checkbox,
      selectAllRowsOnPage: false,
      displayCheck: (row: any, column: string, value: any) => {
        return false;
      },
      selectCheck: (row: any, column: string, value: any) => {
        return false;
      },
      selected: [],
      sorts: [
        {
          prop: 'id',
          dir: 'asc',
        },
      ],
      sortType: SortType.single, // multi, // single,
      groupRows: false,
      groupRowsBy: '',
      treeFromRelation: '',
      treeToRelation: '',
    };
  }

  protected getDefaultColumnCheckboxableSettings(
    options: any = {}
  ): DataTableOneColumnSetting {
    return {
      name: '',
      // prop: null,
      width: 30,
      resizeable: false,
      sortable: false,
      draggable: false,
      canAutoResize: false,
      checkboxable: true,
      headerCheckboxable: true,
      headerCheckboxableUseDefaultTemplates: true,
    };
  }

  protected getDefaultColumnsSettings(
    options: any = {}
  ): DatatableColumnsSettings {
    return {
      columns: [this.getDefaultColumnCheckboxableSettings()],
    };
  }

  protected getDefaultViewSettings(options: any = {}): DatatableViewSettings {
    return {
      columnMode: ColumnMode.force, // standard, force, flex,
      loadingIndicator: true,
      footerPagingPageSizeOptions: [5, 10, 20, 50, 100],
      /*
      cssLtrClasses: {
        sortAscending: 'datatable-icon-down',
        sortDescending: 'datatable-icon-up',
        pagerLeftArrow: 'datatable-icon-left',
        pagerRightArrow: 'datatable-icon-right',
        pagerPrevious: 'datatable-icon-prev',
        pagerNext: 'datatable-icon-skip',
      },
      cssRtlClasses: {
        sortAscending: 'datatable-icon-down',
        sortDescending: 'datatable-icon-up',
        pagerLeftArrow: 'datatable-icon-right',
        pagerRightArrow: 'datatable-icon-left',
        pagerPrevious: 'datatable-icon-skip',
        pagerNext: 'datatable-icon-prev',
      },
      */
      rowClass: (row: any) => {
        return {};
      },
      headerHeight: 30,
      rowHeight: 'auto', // 45
      rowDetailsTemplate: undefined,
      groupExpansionDefault: undefined,
      groupRowsHeaderTemplate: undefined,
      groupRowsHeaderHeight: 40,
      footerHide: false,
      footerShowCustomTemplate: true,
      footerHeight: 60,
      footerMobileHeight: 120,
      footerTabletHeight: 60,
      footerDesktopHeight: 60,
      reorderable: true,
      swapColumns: true,
      scrollbarH: false,
      scrollbarV: false,
      virtualization: true,
      toggleRowDetailByWindowSize: false,
      tableClasses: '',
    };
  }

  protected getDefaultExtraSettings(options: any = {}): any {
    return {};
  }
}
