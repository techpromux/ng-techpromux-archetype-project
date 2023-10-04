import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FooterModule,
  GridModule,
  HeaderModule,
  NavModule,
  SidebarModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CoreServiceTranslationModule } from '@ng-techpromux-archetype-project/core-service';
import { ExtNgxPerfectScrollbarModule } from '@ng-techpromux-archetype-project/ext-ngx-perfect-scrollbar';
import { DefaultLayoutComponent } from './component/layout/default-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // --------------------------------
    IconModule,
    NavModule,
    HeaderModule,
    SidebarModule,
    GridModule,
    FooterModule,
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
    ExtNgxPerfectScrollbarModule,
    CoreServiceTranslationModule,
    // --------------------------------
  ],
  declarations: [DefaultLayoutComponent],
  providers: [],
  exports: [DefaultLayoutComponent],
})
export class CoreLayoutModule {}
