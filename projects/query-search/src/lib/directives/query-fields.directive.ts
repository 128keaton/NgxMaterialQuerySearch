import {ContentChildren, Directive, QueryList} from '@angular/core';
import {QueryFieldDirective} from './query-field.directive';
import {QueryField} from '../models';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

@Directive({
  selector: 'query-fields',
})
export class QueryFieldsDirective {

  @ContentChildren(QueryFieldDirective) fields: QueryList<QueryFieldDirective>;

  getFields(): QueryField[] {
    return this.fields.map(field => {
      let fieldValues = field.values;

      if (fieldValues instanceof Observable) {
        fieldValues = (fieldValues as Observable<any>).pipe(
          shareReplay(1)
        );
      }

      return {
        name: field.name,
        values: fieldValues,
        type: field.type,
        format: field.format,
        label: field.label,
        tooltip: field.tooltip,
        maxLength: field.maxLength
      };
    });
  }

}
