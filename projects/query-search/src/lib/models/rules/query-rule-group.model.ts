import {QueryRule} from './query-rule.model';

export class QueryRuleGroup {
  condition: 'AND' | 'OR' = 'AND';
  rules: (QueryRuleGroup | QueryRule)[] = [];

  constructor(condition: 'AND' | 'OR' = 'AND', rules: (QueryRuleGroup | QueryRule)[] = []) {
    this.condition = condition;
    this.rules = rules;
  }
}
