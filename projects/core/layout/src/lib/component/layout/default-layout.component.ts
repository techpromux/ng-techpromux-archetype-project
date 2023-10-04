/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { INavData, SidebarService } from '@coreui/angular';
import { Select, Store } from '@ngxs/store';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';
import { ElementsResizeObserverService } from '@ng-techpromux-archetype-project/core-ui';
import { Observable } from 'rxjs';
import { LayoutSidebarUnfoldableToggleStoreAction } from '../../store/action/layout-sidebar-unfoldable-toggle-store.action';
import { LayoutStoreState } from '../../store/state/layout-store.state';
import { slideInAnimations } from '../animations';

// navItems = [];

@Component({
  selector: 'techpromux-layout-default',
  templateUrl: './default-layout.component.html',
  animations: [
    // noneAnimations,
    // faderAnimations,
    slideInAnimations,
    // slideLeftRightAnimations,
    // translateRotateAnimations
  ],
})
export class DefaultLayoutComponent
  extends AbstractComponent
  implements OnInit
{
  // ---------------------------------------------------------------------

  private store: Store = inject<Store>(Store);

  private contexts: ChildrenOutletContexts = inject<ChildrenOutletContexts>(
    ChildrenOutletContexts
  );

  private sidebarService: SidebarService =
    inject<SidebarService>(SidebarService);

  // ---------------------------------------------------------------------

  @Select(LayoutStoreState.isSidebarUnfoldableToggled)
  private sidebarUnfoldableToggled$!: Observable<boolean>;

  // ---------------------------------------------------------------------

  @Input() showSidebarToggler: boolean = true;

  @Input() showSidebarInitialFolded: boolean = false;

  @Input() restoreSidebarFoldedStatusOnLoad: boolean = false;

  sidebarFoldedCurrentStatus: boolean | null = null;

  // ---------------------------------------------------------------------

  @Input() mainNavItems: INavData[] = [];

  @Input() footerNavItems: INavData[] = [];

  // ---------------------------------------------------------------------

  @Input() theme: 'light' | 'dark' = 'light'; // dark

  // ---------------------------------------------------------------------

  perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  // ---------------------------------------------------------------------

  constructor() {
    super();
    //
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.restoreSidebarFoldedStatusOnLoad) {
      this.sidebarFoldedCurrentStatus = null;
    } else {
      this.sidebarFoldedCurrentStatus = this.showSidebarInitialFolded;
    }

    this.addSubscription(
      this.sidebarUnfoldableToggled$.subscribe((data) => {
        if (
          this.restoreSidebarFoldedStatusOnLoad &&
          this.sidebarFoldedCurrentStatus === null
        ) {
          if (
            data !== null &&
            this.showSidebarInitialFolded !== data &&
            !ElementsResizeObserverService.hasMobileSize()
          ) {
            setTimeout(() => {
              this.sidebarService.toggle({
                toggle: 'unfoldable',
                id: 'sidebar',
              });
            }, 100);
          }
        }

        this.sidebarFoldedCurrentStatus = data;
      })
    );
  }

  onSideBarToggle($event: any): void {
    if (!ElementsResizeObserverService.hasMobileSize()) {
      this.store.dispatch(
        new LayoutSidebarUnfoldableToggleStoreAction(
          !this.sidebarFoldedCurrentStatus
        )
      );
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  getRouteAnimationData(): string {
    // this.logger.console.debug(this.__classname, 'getRouteAnimationData');

    const currentTextDirectionInverted = this.store.selectSnapshot<boolean>(
      (state: any) => state.translation.textDirectionInverted
    );

    const routeAnimation =
      this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];

    const animation = routeAnimation
      ? routeAnimation
      : currentTextDirectionInverted
      ? 'isRight'
      : 'isLeft';

    // this.logger.console.debug(this.__classname, 'routeAnimation', animation);

    return animation;
  }
}
