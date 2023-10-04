import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule, NavModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { MenuLanguageChooserComponent } from './component/menu-language-chooser/menu-language-chooser.component';

@NgModule({
  imports: [CommonModule, IconModule, NavModule, HeaderModule],
  declarations: [MenuLanguageChooserComponent],
  exports: [MenuLanguageChooserComponent],
})
export class CoreUiTranslationModule {}
