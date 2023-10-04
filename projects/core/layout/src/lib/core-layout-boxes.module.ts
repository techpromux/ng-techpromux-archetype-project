import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CardModule,
  GridModule,
  HeaderModule,
  NavModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NavbarBoxComponent } from './component/box/navbar-box/navbar-box.component';
import { PageBoxComponent } from './component/box/page-box/page-box.component';
import { PanelBoxComponent } from './component/box/panel-box/panel-box.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // --------------------------------
    IconModule,
    NavModule,
    HeaderModule,
    GridModule,
    CardModule,
    /*
    ,
    HeaderModule,
    ,
    ,
    BadgeModule,
    ButtonModule,
    IconModule,
    AvatarModule,
    NavModule,
    BreadcrumbModule,
    DropdownModule,
    */
    // --------------------------------
  ],
  declarations: [NavbarBoxComponent, PanelBoxComponent, PageBoxComponent],
  providers: [],
  exports: [NavbarBoxComponent, PanelBoxComponent, PageBoxComponent],
})
export class CoreLayoutBoxesModule {}
