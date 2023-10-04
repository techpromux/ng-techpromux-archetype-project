import {
  AnimationTriggerMetadata,
  transition,
  trigger,
} from '@angular/animations';
import { translateTo } from './utils-functions.animations';

export const translateRotateAnimations: AnimationTriggerMetadata = trigger(
  'routeAnimations',
  [
    transition('* => isLeft', translateTo({ x: -100, y: -100, rotate: -720 })),
    transition('* => isRight', translateTo({ x: 100, y: -100, rotate: 90 })),
    transition('isRight => *', translateTo({ x: -100, y: -100, rotate: 360 })),
    transition('isLeft => *', translateTo({ x: 100, y: -100, rotate: -360 })),
    transition('* => *', translateTo({ x: -100, y: -100, rotate: 360 })),
  ]
);
