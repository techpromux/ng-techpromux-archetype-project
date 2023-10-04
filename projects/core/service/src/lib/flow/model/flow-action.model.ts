import { FlowStepModel } from './flow-step.model';

export interface FlowActionModel {
  context: string;
  module: string;
  action: string;
  steps: FlowStepModel[];
}
