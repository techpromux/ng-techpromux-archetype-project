/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractCoreUiComponent } from '@ng-techpromux-archetype-project/core-ui';

@Component({
  selector: 'techpromux-abstract-ui-component',
  template: '',
})
export abstract class AbstractUiComponent
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
