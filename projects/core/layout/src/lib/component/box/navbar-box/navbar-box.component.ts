import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';

@Component({
  selector: 'techpromux-ui-navbar-box',
  templateUrl: './navbar-box.component.html',
  styleUrls: ['./navbar-box.component.scss'],
})
export class NavbarBoxComponent extends AbstractComponent implements OnInit {
  @Input() autoJustify = true;

  @Input() customClasses = 'd-flex justify-content-end';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
