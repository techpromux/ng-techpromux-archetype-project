import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OptionItemLabelPipe } from './pipe/option-item-label.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [OptionItemLabelPipe],
  providers: [OptionItemLabelPipe],
  exports: [
    OptionItemLabelPipe,
    // ---------------------------------
  ],
})
export class CoreUiOptionsListsModule {}
