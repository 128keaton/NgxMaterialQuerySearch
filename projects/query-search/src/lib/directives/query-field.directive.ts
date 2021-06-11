import {Directive, Input, OnInit} from '@angular/core';

@Directive({
  selector: 'query-field',
})
export class QueryFieldDirective implements OnInit {

  @Input()
  name: string;

  @Input()
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';

  @Input()
  values: any[];

  @Input()
  format?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
