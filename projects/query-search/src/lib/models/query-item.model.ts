import {QueryBase} from "./query-base.model";
import {transformValue} from "../query-search.helpers";
import {ConditionOperator} from "../enums/condition-operator.enum";
import {QueryRule} from "./rules/query-rule.model";

export class QueryItem extends QueryBase {
  fieldName: string;
  condition: string;
  value: any;
  type: string;

  get filterValue(): QueryRule {
    if (!!this.fieldName && !!this.condition && this.value !== undefined && !!this.type) {
      return {
        field: this.fieldName,
        operator: (ConditionOperator as any)[this.condition],
        value: transformValue(this.value, this.type),
        type: this.type,
        active: true,
        valid: true
      }
    }
    return {
      active: false,
      valid: false
    };
  }
}
