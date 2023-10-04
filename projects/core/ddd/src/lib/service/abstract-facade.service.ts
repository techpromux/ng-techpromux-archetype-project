/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDevMode } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';

export abstract class AbstractFacadeService extends AbstractService {
  protected constructor() {
    super();
  }

  protected getCurrentEncodeDecodeVersion(): string {
    return isDevMode() ? 'json' : 'json';
  }

  protected utilEncodeData(data: any, method: string = 'json'): string {
    try {
      switch (method) {
        case 'json':
          return JSON.stringify(data);
        case 'base64':
          return btoa(JSON.stringify(data));
      }
      return JSON.stringify(data);
    } catch (err) {
      this.logger.console.error(this.__classname, err);
      return '';
    }
  }

  protected utilDecodeData(data: string, method: string = 'json'): any {
    try {
      switch (method) {
        case 'json':
          return JSON.parse(data);
        case 'base64':
          return JSON.parse(atob(data));
      }
      return JSON.parse(data);
    } catch (err) {
      this.logger.console.error(this.__classname, err);
      return null;
    }
  }

  public abstract reset(): void;
}
