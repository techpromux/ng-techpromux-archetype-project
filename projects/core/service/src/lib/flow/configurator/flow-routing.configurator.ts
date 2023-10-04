/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { v4 as uuid4 } from 'uuid';
import { RouteConfigModel } from '../model/route-config.model';
import { RouteFlowStepModel } from '../model/route-flow-step.model';

@Injectable()
export class FlowRoutingConfigurator {
  public static getRoutesFromConfig(
    routes: Routes,
    routesConfigs: RouteConfigModel[],
    context: string,
    module: string,
    options: { guards?: any[] } = {}
  ): Routes {
    const moduleRoutes: Routes = [];

    routesConfigs.forEach((routeConfig: RouteConfigModel, i: number) => {
      if (routeConfig.enabled !== false) {
        if (
          Array.isArray(routeConfig.flowConfig.steps) &&
          routeConfig.flowConfig.steps.length !== 0
        ) {
          routeConfig.flowConfig.steps.forEach(
            (stepConfig: RouteFlowStepModel, j: number) => {
              if (stepConfig.enabled) {
                // if (stepConfig.defaultStep) {
                //   moduleRoutes.push({
                //     path: routeConfig.path,
                //     redirectTo: routeConfig.path + '/' + stepConfig.path,
                //     pathMatch: 'full'
                //   });
                // }

                const requireRoles: any[] = [];

                requireRoles.push(
                  ...(routeConfig.requiredRoles
                    ? routeConfig.requiredRoles
                    : [])
                );

                const routeData = Object.assign(
                  {
                    enabled: stepConfig.enabled,
                    requiredRoles: [...new Set(requireRoles)],
                    requiredRolesOperator: routeConfig.requiredRolesOperator,
                    flowDataConfig: {
                      context: context.toLowerCase(),
                      module: module.toLowerCase(),
                      action: routeConfig.data?.action
                        ? routeConfig.data.action.toLocaleLowerCase()
                        : routeConfig.path.toLowerCase(),
                      actionIsDefault:
                        routeConfig.flowConfig.isDefaultModuleAction,
                      actionIsEnabled: routeConfig.enabled,
                      step: stepConfig.path.toLowerCase(),
                      stepIsDefault: stepConfig.isDefaultActionStep,
                      stepIsEnabled: stepConfig.enabled,
                    },
                  },
                  routeConfig.data ? routeConfig.data : {},
                  stepConfig.data ? stepConfig.data : {}
                );

                if (!routeData.animation || routeData.animation === 'default') {
                  routeData.animation = uuid4();
                }

                moduleRoutes.push({
                  path: routeConfig.path + '/' + stepConfig.path,
                  component: stepConfig.component as any,
                  data: routeData,
                  canActivate: [
                    ...(routeConfig.guards ? routeConfig.guards : []),
                    ...(options?.guards ? options.guards : []),
                  ],
                  canActivateChild: [
                    ...(routeConfig.guards ? routeConfig.guards : []),
                    ...(options?.guards ? options.guards : []),
                  ],
                  canLoad: [
                    ...(routeConfig.guards ? routeConfig.guards : []),
                    ...(options?.guards ? options.guards : []),
                  ],
                });
              }
            }
          );
        } else {
          if (routeConfig.flowConfig.isDefaultModuleAction) {
            moduleRoutes.push({
              path: '',
              redirectTo: routeConfig.path,
              pathMatch: 'full',
            });
          }

          const routeData = Object.assign(
            {
              enabled: routeConfig.enabled,
              requiredRoles: routeConfig.requiredRoles
                ? routeConfig.requiredRoles
                : [],
              requiredRolesOperator: routeConfig.requiredRolesOperator
                ? routeConfig.requiredRolesOperator
                : 'and',
              flowDataConfig: {
                context: context.toLowerCase(),
                module: module.toLowerCase(),
                action: routeConfig.data?.action
                  ? routeConfig.data.action.toLocaleLowerCase()
                  : routeConfig.path.toLowerCase(),
                actionIsDefault: routeConfig.flowConfig.isDefaultModuleAction,
                actionIsEnabled: routeConfig.enabled,
                step: null,
                stepIsDefault: null,
                stepIsEnabled: null,
              },
            },
            routeConfig.data ? routeConfig.data : {}
          );

          if (!routeData.animation || routeData.animation === 'default') {
            routeData.animation = uuid4();
          }

          moduleRoutes.push({
            path: routeConfig.path,
            component: routeConfig.component as any,
            data: routeData,
            canActivate: [
              ...(routeConfig.guards ? routeConfig.guards : []),
              ...(options?.guards ? options.guards : []),
            ],
            canActivateChild: [
              ...(routeConfig.guards ? routeConfig.guards : []),
              ...(options?.guards ? options.guards : []),
            ],
            canLoad: [
              ...(routeConfig.guards ? routeConfig.guards : []),
              ...(options?.guards ? options.guards : []),
            ],
          });
        }
      }
    });

    routes.push(...moduleRoutes);

    // console.log(context, module, moduleRoutes);

    return routes;
  }

  public static getStorableConfig(
    routesConfigs: RouteConfigModel[]
  ): RouteConfigModel[] {
    return routesConfigs.map((item) => {
      const copy: RouteConfigModel = { ...item };
      if (copy.component) {
        copy.component = copy.component.constructor.name;
      }
      if (copy.guards) {
        copy.guards = [];
      }
      if (copy.flowConfig.steps && copy.flowConfig.steps.length > 0) {
        copy.flowConfig = { ...copy.flowConfig };
        const stepsCopy: RouteFlowStepModel[] = [];
        copy.flowConfig.steps?.forEach((step: any) => {
          const stepCopy = { ...step };
          stepCopy.component = stepCopy.component.constructor.name;
          // cps.guards = [];
          stepsCopy.push(stepCopy);
        });
        copy.flowConfig.steps = stepsCopy;
      }
      return copy;
    });
  }
}
