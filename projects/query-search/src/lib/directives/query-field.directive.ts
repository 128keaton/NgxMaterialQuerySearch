import {Directive, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {ProvidedValue} from '../models';

@Directive({
  selector: 'query-field',
})
export class QueryFieldDirective {

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

  @Input()
  maxLength?: number;
}
