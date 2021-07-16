import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';

export const inOutAnimations = [
  trigger('inOut', [
    transition('* => *', [
      query(':enter',
        [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
        { optional: true }
      ),
      query(':leave',
        animate('200ms', style({ opacity: 0 })),
        { optional: true}
      )
    ])
  ]),
  trigger('inOutItem', [
    transition('* => *', [
      query(':enter',
        [style({ opacity: 0, transform: 'translateY(-100px)' }), stagger('40ms', animate('300ms ease-out', style({ opacity: 1, transform: '*' })))],
        { optional: true }
      ),
      query(':leave',
        animate('100ms', style({ opacity: 0, transform: 'translateY(100px)' })),
        { optional: true}
      )
    ])
  ]),
];
