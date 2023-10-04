import {
  animate,
  AnimationTriggerMetadata,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const faderAnimations: AnimationTriggerMetadata = trigger(
  'routeAnimations',
  [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0) translateY(100%)',
        }),
      ]),
      query(':enter', [
        animate(
          '600ms ease-in',
          style({ opacity: 1, transform: 'scale(0.5) translateY(0)' })
        ),
      ]),
    ]),
  ]
);
