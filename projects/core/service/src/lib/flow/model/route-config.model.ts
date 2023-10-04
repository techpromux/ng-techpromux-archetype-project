/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteFlowActionModel } from './route-flow-action.model';

export interface RouteConfigModel {
  // -----------------------------------
  enabled: boolean;
  // -----------------------------------
  path: string;
  component?: any;
  data?: any;
  // -----------------------------------
  guards: any[];
  requiredRolesOperator?: 'string';
  requiredRoles: string[];
  // -----------------------------------
  flowConfig: RouteFlowActionModel;
  // -----------------------------------
}
