/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteFlowStepModel } from './route-flow-step.model';

export interface RouteFlowActionModel {
  path: string;
  isDefaultModuleAction?: boolean;
  steps?: RouteFlowStepModel[];
  data?: any;
}
