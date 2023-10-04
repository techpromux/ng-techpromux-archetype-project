/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalAlertResultModel {
  closed: boolean;
  confirmed: boolean;
  canceled: boolean;

  eventName: string;
  eventData: any;
}
