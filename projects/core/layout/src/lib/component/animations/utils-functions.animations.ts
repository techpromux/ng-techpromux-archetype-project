import {
  animate,
  animateChild,
  AnimationGroupMetadata,
  AnimationQueryMetadata,
  AnimationStyleMetadata,
  group,
  query,
  style,
} from '@angular/animations';

export function slideTo(
  direction: string
): (
  | AnimationQueryMetadata
  | AnimationGroupMetadata
  | AnimationStyleMetadata
)[] {
  const optional = { optional: true };
  return [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '100%' })], optional),
    query(':leave', animateChild(), optional),
    group([
      query(
        ':leave',
        [
          animate(
            '200ms ease-out',
            style({ [direction]: '-100%', opacity: 0 })
          ),
        ],
        optional
      ),
      query(
        ':enter',
        [animate('300ms ease-out', style({ [direction]: '0%' }))],
        optional
      ),
      query('@*', animateChild(), { optional: true }),
    ]),
  ];
}

export function translateTo({
  x = 100,
  y = 0,
  rotate = 0,
}): (AnimationQueryMetadata | AnimationGroupMetadata)[] {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [
      style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)` }),
    ]),
    group([
      query(
        ':leave',
        [
          animate(
            '300ms ease-out',
            style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)` })
          ),
        ],
        optional
      ),
      query(':enter', [
        animate(
          '300ms ease-out',
          style({ transform: `translate(0, 0) rotate(0)` })
        ),
      ]),
    ]),
  ];
}
