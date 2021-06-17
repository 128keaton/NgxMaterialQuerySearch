import {Directive, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ProvidedValue} from "../models";

@Directive({
  selector: 'query-field',
})
export class QueryFieldDirective implements OnInit {

  @Input()
  name: string;

  @Input()
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';

  @Input()
  values: any[] | Observable<any[]> | ProvidedValue[] | Observable<ProvidedValue[]>;

  @Input()
  format?: string;

  @Input()
  label?: string;

  @Input()
  tooltip?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
