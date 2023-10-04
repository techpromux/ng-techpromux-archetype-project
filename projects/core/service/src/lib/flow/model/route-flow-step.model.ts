/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RouteFlowStepModel {
  enabled: boolean;
  path: string;
  component?: any;
  isDefaultActionStep?: boolean;
  canBackwardToPreviousStep?: boolean;
  data?: any;
}
