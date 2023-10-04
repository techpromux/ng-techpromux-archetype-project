import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';

@Component({
  selector: 'techpromux-ui-panel-box',
  templateUrl: './panel-box.component.html',
  styleUrls: ['./panel-box.component.scss'],
})
export class PanelBoxComponent extends AbstractComponent implements OnInit {
  @Input() customClasses = '';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
