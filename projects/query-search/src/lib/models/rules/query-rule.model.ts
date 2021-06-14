import {ConditionOperator} from "../../enums/condition-operator.enum";

export class QueryRule {
  label?: string;
  field?: string;
  operator?: ConditionOperator;
  type?: string;
  value?: any;
  active: boolean;
  valid: boolean;
}
