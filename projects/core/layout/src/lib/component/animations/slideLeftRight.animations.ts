import {
  AnimationTriggerMetadata,
  transition,
  trigger,
} from '@angular/animations';
import { slideTo } from './utils-functions.animations';

export const slideLeftRightAnimations: AnimationTriggerMetadata = trigger(
  'routeAnimations',
  [
    transition('* => isLeft', slideTo('left')),
    transition('* => isRight', slideTo('right')),
    transition('isRight => *', slideTo('left')),
    transition('isLeft => *', slideTo('right')),
    transition('* => *', slideTo('right')),
  ]
);
