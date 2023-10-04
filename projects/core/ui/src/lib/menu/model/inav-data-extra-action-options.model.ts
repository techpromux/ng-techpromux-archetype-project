/* eslint-disable @typescript-eslint/no-explicit-any */

export interface INavDataExtraActionOptions {
  isEnabledFn: (options: any) => boolean;
  onClickActionFn: (options: any) => boolean;
}
