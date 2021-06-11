import {ContentChildren, Directive, QueryList} from '@angular/core';
import {QueryFieldDirective} from "./query-field.directive";
import {QueryField} from "../models";

@Directive({
  selector: 'query-fields',
})
export class QueryFieldsDirective {

  @ContentChildren(QueryFieldDirective) fields: QueryList<QueryFieldDirective>;

  getFields(): QueryField[] {
    return this.fields.map(field => {
      return {
        name: field.name,
        values: field.values,
        type: field.type,
        format: field.format
      }
    });
  }

}
