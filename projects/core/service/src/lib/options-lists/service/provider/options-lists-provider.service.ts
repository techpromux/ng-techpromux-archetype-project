import { OptionsListsManagerService } from '../manager/options-lists-manager.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OptionsListsProviderService {
  // -------------------------------------------------

  init(data?: any): Promise<boolean>;

  // -------------------------------------------------

  setOptionsListManagerService(manager: OptionsListsManagerService): void;

  // -------------------------------------------------

  getProviderId(): string;

  // -------------------------------------------------

  getSupportedOptionsListsKeys(): string[];

  // -------------------------------------------------

  loadOptionsLists(keys: string[], lang: string): Promise<boolean>;

  // -------------------------------------------------
}
