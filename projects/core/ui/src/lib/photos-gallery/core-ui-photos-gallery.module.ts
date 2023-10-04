import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { PhotosGalleryComponent } from './component/photos-gallery/photos-gallery.component';

@NgModule({
  imports: [
    CommonModule,
    // ---------------------------------
    ButtonModule,
    IconModule,
    /*
    CardModule,
    GridModule,
    CalloutModule,
    ProgressModule,
    ButtonGroupModule,
    TabsModule,
    FormModule,
    ListGroupModule,
    ChartjsModule,
    WidgetModule,
    NavModule,
    DropdownModule,
    AvatarModule,
    TableModule,
    UtilitiesModule,
    SharedModule,
    */
    // ---------------------------------
  ],
  declarations: [PhotosGalleryComponent],
  providers: [],
  exports: [
    // ---------------------------------
    PhotosGalleryComponent,
    // ---------------------------------
  ],
})
export class CoreUiPhotosGalleryModule {}
