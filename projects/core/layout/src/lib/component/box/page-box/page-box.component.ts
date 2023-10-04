import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';

@Component({
  selector: 'techpromux-ui-page-box',
  templateUrl: './page-box.component.html',
  styleUrls: ['./page-box.component.scss'],
})
export class PageBoxComponent extends AbstractComponent implements OnInit {
  @Input() customClasses = '';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
