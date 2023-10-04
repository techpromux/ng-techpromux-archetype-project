/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';

import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { TranslationStoreState } from '@ng-techpromux-archetype-project/core-service';
import { Select } from '@ngxs/store';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  take,
  timer,
} from 'rxjs';
import { ElementsResizeObserverService } from '../../../resize-observer/service/elements-resize-observer.service';
import { DatatableSettingsHandler } from '../../handler/datatable-settings.handler';
import { DatatableColumnsSettings } from '../../model/datatable-columns.settings';
import { DatatableDataSettings } from '../../model/datatable-data.settings';
import { DatatableViewSettings } from '../../model/datatable-view.settings';

@Component({
  selector: 'techpromux-ui-datatable-default',
  templateUrl: './default-datatable.component.html',
  styleUrls: ['./default-datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultDatatableComponent
  extends AbstractComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked
{
  // --------------------------------------------------------------------------

  @Input() settingsHandler!: DatatableSettingsHandler;

  @Input() dataSettings!: DatatableDataSettings;

  @Input() columnsSettings!: DatatableColumnsSettings;

  @Input() viewSettings!: DatatableViewSettings;

  @Input() extraSettings!: any;

  // --------------------------------------------------------------------------

  @Output() paged: EventEmitter<any> = new EventEmitter<any>();

  @Output() sorted: EventEmitter<any> = new EventEmitter<any>();

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  // --------------------------------------------------------------------------

  @ViewChild('datatableWrapper', { static: true })
  private datatableWrapper!: ElementRef;

  private datatableWrapperInnerWidth = 0;

  @ViewChild('dataTable', { static: true })
  private dataTable!: DatatableComponent;

  @ViewChild('fieldTranslatableHeaderTpl', { static: true, read: TemplateRef })
  fieldTranslatableHeaderTpl!: TemplateRef<any>;

  @ViewChild('fieldCheckboxableHeaderTpl', { static: true, read: TemplateRef })
  fieldCheckboxableHeaderTpl!: TemplateRef<any>;

  @ViewChild('fieldCheckboxableCellTpl', { static: true, read: TemplateRef })
  fieldCheckboxableCellTpl!: TemplateRef<any>;

  // --------------------------------------------------------------------------

  public currentTableSettings!: {
    dataSettings: DatatableDataSettings;
    columnsSettings: DatatableColumnsSettings;
    viewSettings: DatatableViewSettings;
    extraSettings: any;
  };

  selectedItems: any = [];
  selectAllOnPage: any = [];

  @Select(TranslationStoreState.getTextDirectionInverted)
  protected currentTextDirectionInverted!: Observable<boolean>;

  // --------------------------------------------------------------------------

  private cd: ChangeDetectorRef = inject<ChangeDetectorRef>(ChangeDetectorRef);

  protected defaultHandler: DatatableSettingsHandler =
    inject<DatatableSettingsHandler>(DatatableSettingsHandler);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elRef: ElementRef
  ) {
    super();

    this.defaultHandler.reset();

    this.currentTableSettings = {
      dataSettings: Object.assign({}, this.defaultHandler.dataSettings),
      columnsSettings: Object.assign({}, this.defaultHandler.columnsSettings),
      viewSettings: Object.assign({}, this.defaultHandler.viewSettings),
      extraSettings: Object.assign({}, this.defaultHandler.extraSettings),
    };
  }

  // --------------------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();

    this.addSubscription(
      ElementsResizeObserverService.getElementsResizeObserverService(
        'window',
        false
      )
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          this.updateAndRepairTableSizes();
        })
    );

    this.addSubscription(
      ElementsResizeObserverService.getElementsResizeObserverService(
        'body',
        false
      )
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          this.updateAndRepairTableSizes();
        })
    );

    this.addSubscription(
      this.currentTextDirectionInverted
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          this.updateAndRepairTableSizes();
        })
    );

    this.addSubscription(
      timer(200, 250)
        .pipe(take(10))
        .subscribe(() => {
          window.dispatchEvent(new Event('resize'));
          document.body.dispatchEvent(new Event('resize'));
        })
    );
  }

  override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();

    if (
      this.dataTable &&
      this.dataTable.recalculate &&
      this.datatableWrapper?.nativeElement?.clientWidth !==
        this.datatableWrapperInnerWidth
    ) {
      this.datatableWrapperInnerWidth =
        this.datatableWrapper?.nativeElement?.clientWidth;
      this.dataTable.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.updateCurrentTableSettingsFromInputs();
  }

  // --------------------------------------------------------------------------

  protected updateCurrentTableSettingsFromInputs(): void {
    if (this.settingsHandler && !this.settingsHandler.hasBeenReset()) {
      throw new Error(
        'You must call "reset()" method in [' +
          this.settingsHandler.constructor.name +
          '] settings handler.'
      );
    }

    const tableSettings: {
      dataSettings: DatatableDataSettings;
      columnsSettings: DatatableColumnsSettings;
      viewSettings: DatatableViewSettings;
      extraSettings: any;
    } = {
      dataSettings: Object.assign(
        {},
        this.defaultHandler.dataSettings,
        this.currentTableSettings?.dataSettings,
        this.settingsHandler?.dataSettings
          ? this.settingsHandler?.dataSettings
          : {},
        this.dataSettings ? this.dataSettings : {}
      ) as DatatableDataSettings,
      columnsSettings: Object.assign(
        {},
        this.defaultHandler.columnsSettings,
        this.currentTableSettings?.columnsSettings,
        this.settingsHandler?.columnsSettings
          ? this.settingsHandler?.columnsSettings
          : {},
        this.columnsSettings ? this.columnsSettings : {}
      ) as DatatableColumnsSettings,
      viewSettings: Object.assign(
        {},
        this.defaultHandler.viewSettings,
        this.currentTableSettings.viewSettings,
        this.settingsHandler?.viewSettings
          ? this.settingsHandler?.viewSettings
          : {},
        this.viewSettings ? this.viewSettings : {}
      ) as DatatableViewSettings,
      extraSettings: Object.assign(
        {},
        this.defaultHandler.extraSettings,
        this.currentTableSettings.extraSettings,
        this.settingsHandler?.extraSettings
          ? this.settingsHandler?.extraSettings
          : {},
        this.extraSettings ? this.extraSettings : {}
      ) as any,
    };

    tableSettings.columnsSettings.columns.map((config) => {
      if (
        config.headerCheckboxable &&
        config.checkboxable &&
        config.headerCheckboxableUseDefaultTemplates
      ) {
        config.headerTemplate = this.fieldCheckboxableHeaderTpl;
        config.cellTemplate = this.fieldCheckboxableCellTpl;
        config.checkboxable = false;
        config.headerCheckboxable = false;
      }
      return config;
    });

    tableSettings.columnsSettings.columns.map((config) => {
      if (config.nameTranslation && !config.headerTemplate) {
        config.headerTemplate = this.fieldTranslatableHeaderTpl;
      }
      return config;
    });

    // to avoid error in write permissions on select events

    tableSettings.dataSettings.selected = tableSettings.dataSettings.selected
      ? [...tableSettings.dataSettings.selected]
      : [];

    this.currentTableSettings = tableSettings;

    this.checkAllSelectedInCurrentPage(
      this.currentTableSettings.dataSettings.selected
    );

    this.updateAndRepairTableSizes();
  }

  // --------------------------------------------------------------------------

  public hasMobileSize(): boolean {
    return ElementsResizeObserverService.hasMobileSize();
  }

  public hasTabletSize(): boolean {
    return ElementsResizeObserverService.hasTabletSize();
  }

  public hasDesktopSize(): boolean {
    return ElementsResizeObserverService.hasDesktopSize();
  }

  protected updateAndRepairTableSizes(): void {
    setTimeout(() => {
      this.toggleAllRowsDetailsByWindowsSize();
      this.resizeFooterHeight();
    }, 200);
  }

  protected toggleAllRowsDetailsByWindowsSize(): void {
    if (this.currentTableSettings.viewSettings.toggleRowDetailByWindowSize) {
      // this.dataTableComponent?.recalculate();
      if (this.hasMobileSize()) {
        this.expandAllRowsDetails();
      } else {
        this.collapseAllRowsDetails();
      }
    }
  }

  protected resizeFooterHeight(): void {
    if (this.currentTableSettings.viewSettings.footerHide) {
      this.currentTableSettings.viewSettings.footerHeight = 0;
      return;
    }
    if (this.hasMobileSize()) {
      this.currentTableSettings.viewSettings.footerHeight = this
        .currentTableSettings.viewSettings.footerMobileHeight
        ? this.currentTableSettings.viewSettings.footerMobileHeight
        : this.currentTableSettings.viewSettings.footerHeight;
    }
    if (this.hasTabletSize()) {
      this.currentTableSettings.viewSettings.footerHeight = this
        .currentTableSettings.viewSettings.footerTabletHeight
        ? this.currentTableSettings.viewSettings.footerTabletHeight
        : this.currentTableSettings.viewSettings.footerHeight;
    }
    if (this.hasDesktopSize()) {
      this.currentTableSettings.viewSettings.footerHeight = this
        .currentTableSettings.viewSettings.footerDesktopHeight
        ? this.currentTableSettings.viewSettings.footerDesktopHeight
        : this.currentTableSettings.viewSettings.footerHeight;
    }
  }

  protected checkAllSelectedInCurrentPage(selected: any[] = []): void {
    // check if all allowed items are selected on current page
    const rowIdentityFn: any =
      this.currentTableSettings?.dataSettings?.rowIdentity;
    const currentPage = this.currentTableSettings.dataSettings.page;

    let hasAllSelected = true;
    let hasOneSelected = false;

    this.currentTableSettings.dataSettings.items.forEach((row: any) => {
      if (this.canDisplayCheck(row)) {
        const find = selected.find((selectedItem: any) => {
          if (rowIdentityFn) {
            return rowIdentityFn(selectedItem) === rowIdentityFn(row);
          }
          return true;
        });
        if (find) {
          hasOneSelected = true;
        } else if (!find) {
          hasAllSelected = false;
        }
      }
    });
    if (!hasAllSelected) {
      this.selectAllOnPage[currentPage] = false;
    }
    if (hasAllSelected && hasOneSelected) {
      this.selectAllOnPage[currentPage] = true;
    }
  }

  public canDisplayCheck(
    row: any,
    column: string = '',
    value: any = null
  ): boolean {
    if (this.currentTableSettings?.dataSettings?.displayCheck) {
      return this.currentTableSettings.dataSettings.displayCheck(
        row,
        column,
        null
      );
    }
    return true;
  }

  // --------------------------------------------------------------------------

  onActivate($event: any): void {
    if ($event.type === 'click') {
      // console.log('onActivate - clicked', $event);
    }
    if ($event.type === 'dblclick') {
      // console.log('onActivate - dblclick', $event);
    }
  }

  onReorder($event: any): void {
    // console.log('onReorder', $event);
  }

  onResize($event: any): void {
    // console.log('onResize', $event);
  }

  onScroll($event: any): void {
    // console.log('onScroll', $event);
  }

  onTreeAction($event: any): void {
    // console.log('onTreeAction', $event);
    // this.cd.detectChanges();
  }

  onTableContextMenu($event: any): void {
    // console.log('onTableContextMenu', $event);
    // $event.event.preventDefault();
    // $event.event.stopPropagation();
  }

  onDetailToggle($event: any): void {
    // console.log('onDetailToggle', $event);
  }

  onPage($event: any): void {
    // console.log('onPage', $event);
    const eventData = {
      page: $event.offset,
      // pageSize: this.itemsDataSettings.pageSize,
    };
    this.paged.emit(eventData);
  }

  onPageSize($event: any = null): void {
    // console.log('onPageSize', $event);
    const pageSizeValue =
      $event && $event.target && $event.target.value
        ? $event.target.value
        : $event;
    const eventData = {
      page: 0,
      pageSize: pageSizeValue,
    };
    this.paged.emit(eventData);
  }

  onSort($event: any): void {
    // console.log('onSort', $event);
    const eventData = $event.newValue
      ? {
          sorts: [
            {
              prop: $event.column.prop,
              dir: $event.newValue,
            },
          ],
          page: 0,
        }
      : {
          page: 0,
        };
    this.sorted.emit(eventData);
  }

  onSelectAll($event: any): void {
    // this.logger.console.debug(this.__classname, 'onSelectAll', $event);

    const rowIdentityFn: any =
      this.currentTableSettings?.dataSettings?.rowIdentity;
    const currentPage = this.currentTableSettings.dataSettings.page;
    const checked = !!this.selectAllOnPage[currentPage];

    let selected = this.currentTableSettings.dataSettings.selected
      ? [...this.currentTableSettings.dataSettings.selected]
      : [];

    // Remove all items in current page from selected list to avoid duplicates.
    if (selected.length > 0) {
      this.currentTableSettings.dataSettings.items.forEach((row: any) => {
        selected = selected.filter((selectedItem: any) => {
          if (rowIdentityFn) {
            return rowIdentityFn(selectedItem) !== rowIdentityFn(row);
          }
          return true;
        });
      });
    }

    if (!checked) {
      // Select all again
      selected.push(
        ...this.currentTableSettings.dataSettings.items.filter((row: any) =>
          this.canDisplayCheck(row)
        )
      );
    }

    this.selectAllOnPage[currentPage] = !checked;

    const eventData = {
      selected: [...selected],
    };

    this.selectedItems = [...selected];

    this.selected.emit(eventData);
  }

  onSelect($event: any): void {
    // this.logger.console.debug(this.__classname, 'onSelect', $event);

    const selected = $event.selected.filter((row: any) =>
      this.canDisplayCheck(row)
    );

    this.checkAllSelectedInCurrentPage(selected);

    const eventData = {
      selected: [...selected],
    };

    this.selectedItems = [...selected];

    this.selected.emit(eventData);
  }

  // --------------------------------------------------------------------------

  public expandAllRowsDetails(): void {
    const table = this.dataTable;
    if (table && table.rowDetail) {
      table.rowDetail.expandAllRows();
      // if (table.groupExpansionDefault === true) {
      //   table.rowDetail.expandAllRows();
      //   // table.rowDetail.collapseAllRows();
      // }
    }
  }

  public collapseAllRowsDetails(): void {
    const table = this.dataTable;
    if (table && table.rowDetail) {
      table.rowDetail.collapseAllRows();
    }
  }

  public toggleExpandRow(row: any): void {
    // console.log('Toggled Expand Row!', row);
    this.dataTable?.rowDetail?.toggleExpandRow(row);
  }

  public toggleExpandGroup(group: any): void {
    // console.log('Toggled Expand Group!', group);
    this.dataTable?.groupHeader?.toggleExpandGroup(group);
  }

  // --------------------------------------------------------------------------
}
