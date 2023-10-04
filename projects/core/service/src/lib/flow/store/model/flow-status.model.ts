/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FlowStatusModel {
  context: string;
  module: string;
  action: string;

  step: string;
  stepParams: any;
  stepIsFirst: boolean;
  stepIsLast: boolean;

  isHome: boolean;
  isDashboard: boolean;

  isReturned: boolean;
  isReturnedConfirmed: boolean;
  isReturnedCanceled: boolean;
  isReturnedClosed: boolean;
  isReturnedWithParams: any;

  flowActionProcessed: string;
  flowActionProcessedAt?: number;
  flowActionQueuePosition?: number;

  flowActionCanClose?: boolean;
  flowActionCanGoHome?: boolean;
  flowActionCanBackward?: boolean;
}
