/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractCoreUiComponent } from '@ng-techpromux-archetype-project/core-ui';

@Component({
  selector: 'techpromux-abstract-feature-component',
  template: '',
})
export abstract class AbstractFeatureComponent
  extends AbstractCoreUiComponent
  implements OnInit, OnDestroy
{
  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
