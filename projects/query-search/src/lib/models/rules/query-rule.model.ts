import {ConditionOperator} from '../../enums';

export class QueryRule {
  label?: string;
  field?: string;
  operator?: ConditionOperator;
  type?: string;
  value?: any;
  active?: boolean;
  valid?: boolean;
}
