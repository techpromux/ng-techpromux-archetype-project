import { Injectable } from '@angular/core';
import { AbstractOptionsListsManagerService } from './abstract-options-lists-manager.service';

@Injectable()
export class DefaultOptionsListsManagerService extends AbstractOptionsListsManagerService {
  constructor() {
    super();
  }
}
