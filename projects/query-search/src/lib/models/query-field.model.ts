import {Observable} from "rxjs";
import {ProvidedValue} from "./provided-value.model";

export interface QueryField {
  name: string;
  type: 'boolean' | 'date' | 'number' | 'string' | 'array';
  values: any[] | Observable<any[]>;
  format?: string;
  label?: string;
  tooltip?: string;
}
