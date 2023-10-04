/* eslint-disable @typescript-eslint/no-explicit-any */

export class LayoutSidebarVisibleToggleStoreAction {
  static readonly type = '[LAYOUT] Sidebar Visible Toggle';

  constructor(public toggle: boolean) {}
}
