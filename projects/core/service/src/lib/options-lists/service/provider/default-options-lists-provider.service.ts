/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { AbstractOptionsListsProviderService } from './abstract-options-lists-provider.service';

@Injectable()
export class DefaultOptionsListsProviderService extends AbstractOptionsListsProviderService {
  constructor() {
    super();
  }

  public override getProviderId(): string {
    return 'default';
  }

  public override getSupportedOptionsListsKeys(): string[] {
    return [];
  }

  public override loadOptionsLists(
    keys: string[],
    lang: string
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
