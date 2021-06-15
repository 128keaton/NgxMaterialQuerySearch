import {Directive, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";

@Directive({
  selector: 'query-field',
})
export class QueryFieldDirective implements OnInit {

  @Input()
  name: string;

  @Input()
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';

  @Input()
  values: any[] | Observable<any[]>;

  @Input()
  format?: string;

  @Input()
  label?: string;


  constructor() { }

  ngOnInit(): void {
  }

}
