import {QueryBase} from "./query-base.model";
import {CondOperator} from "@nestjsx/crud-request";
import {transformValue} from "../query-search.helpers";

export class QueryItem extends QueryBase {
  fieldName: string;
  condition: string;
  value: any;
  type: string;

  get filterValue() {
    if (!!this.fieldName && !!this.condition && this.value !== undefined && !!this.type) {
      return {
        field: this.fieldName,
        operator: (CondOperator as any)[this.condition],
        value: transformValue(this.value, this.type)
      }
    }
    return null;
  }
}
