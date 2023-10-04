export * from './logout.service';
import { LogoutService } from './logout.service';
export * from './module.service';
import { ModuleService } from './module.service';
export * from './relationship.service';
import { RelationshipService } from './relationship.service';
export const APIS = [LogoutService, ModuleService, RelationshipService];
