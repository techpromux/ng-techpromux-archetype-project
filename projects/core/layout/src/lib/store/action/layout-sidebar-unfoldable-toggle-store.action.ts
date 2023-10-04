/* eslint-disable @typescript-eslint/no-explicit-any */

export class LayoutSidebarUnfoldableToggleStoreAction {
  static readonly type = '[LAYOUT] Sidebar Unfoldable Toggle';

  constructor(public toggle: boolean) {}
}
