import {animate, state, style, transition, trigger} from '@angular/animations';

export const inOutAnimations = [
  trigger('inOut', [
    state('in', style({ height: 'auto' })),
    transition('void => *', [
      style({ height: 0 }),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({ height: 0 }))
    ])
  ]),
];
