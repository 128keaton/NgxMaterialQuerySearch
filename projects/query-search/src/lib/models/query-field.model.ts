import {Observable} from 'rxjs';

export interface QueryField {
  name: string;
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';
  values: any[] | Observable<any[]>;
  format?: string;
  label?: string;
  tooltip?: string;
  maxLength?: number;
}
