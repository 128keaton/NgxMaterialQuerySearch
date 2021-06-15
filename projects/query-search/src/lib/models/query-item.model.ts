import {QueryBase} from "./query-base.model";
import {getEnumKeyByEnumValue, isDefined, transformValue} from "../query-search.helpers";
import {ConditionOperator} from "../enums";
import {QueryRule} from "./rules";

export class QueryItem extends QueryBase {
  fieldName: string;
  condition: string;
  value: any;
  type: string;
  active = true;


  static apply(fieldName: string, operator: ConditionOperator, value: any): QueryItem {
    const newItem = new QueryItem();

    newItem.fieldName = fieldName;
    newItem.condition = (getEnumKeyByEnumValue(ConditionOperator, operator) || '');
    newItem.value = value;

    return newItem;
  }

  get filterValue(): QueryRule {
    if (isDefined(this.fieldName) && isDefined(this.type) && isDefined(this.condition) && this.checkNullCondition()) {
      return {
        field: this.fieldName,
        operator: (ConditionOperator as any)[this.condition],
        value: transformValue(this.value, this.type),
        type: this.type,
        active: this.active,
        valid: true
      }
    }
    return {
      active: false,
      valid: false
    };
  }

  private checkNullCondition() {
    if (this.condition.toLowerCase().includes('null')) {
      return true;
    }

    return !!this.value;
  }
}
