/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FlowStepModel {
  step: string;
  params: any;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
}
