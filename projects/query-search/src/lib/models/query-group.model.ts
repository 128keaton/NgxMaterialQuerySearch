import {QueryItem} from './query-item.model';
import {QueryBase} from './query-base.model';
import {QueryRule, QueryRuleGroup} from './rules';
import {ConditionOperator} from '../enums';
import {getEnumKeyByEnumValue} from '../helpers/general.helpers';

export class QueryGroup extends QueryBase {
  type: 'AND' | 'OR';
  items: QueryItem[] = [];
  children: QueryGroup[] = [];

  constructor(type: 'AND' | 'OR', depth: number = 0, autoInsertEmptyItem = true) {
    super();
    this.type = type;
    this.depth = depth;

    if (autoInsertEmptyItem && this.items.length === 0 && this.children.length === 0) {
      this.addItem();
    }
  }

  addItem() {
    this.items.push(new QueryItem());
  }

  loadItem(fieldName: string, operator: ConditionOperator, value: any) {
    if (this.items.length === 1 && !this.items[0].fieldName) {
      this.items = [QueryItem.apply(fieldName, operator, value)];
    } else {
      this.items.push(QueryItem.apply(fieldName, operator, value));
    }
  }

  applyRule(rule: QueryRule) {
    if (!!rule.operator) {
      const newItem = new QueryItem();
      newItem.condition = getEnumKeyByEnumValue(ConditionOperator, rule.operator) as ConditionOperator;
      newItem.fieldName = rule.field || 'unknown';
      newItem.type = rule.type || 'string';
      newItem.value = rule.value;
      this.items.push(newItem);
    }
  }

  apply(group: QueryRuleGroup, callback: () => void) {
    this.type = group.condition;
    this.children = [];
    this.items = [];

    group.rules.forEach(ruleOrGroup => {
      if (ruleOrGroup.hasOwnProperty('condition')) {
        const typedGroup: QueryRuleGroup = ruleOrGroup as QueryRuleGroup;
        const subGroup = new QueryGroup(typedGroup.condition, this.depth + 1, false);
        subGroup.apply(typedGroup, callback);
        this.children.push(subGroup);
      } else {
        this.applyRule(ruleOrGroup as QueryRule);
        callback();
      }
    });
  }

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }

  addChild() {
    this.children.push(new QueryGroup(this.type, this.depth + 1));
  }

  removeChild(id: string) {
    this.children = this.children.filter(c => c.id !== id);
  }

  get filterValue(): QueryRuleGroup | any {
    const itemRules = this.items.map(i => i.filterValue).filter(i => i.valid);
    const childRules = this.children.map(i => i.filterValue).filter(i => !!i);

    const ruleGroup = new QueryRuleGroup(this.type, [...itemRules, ...childRules]);

    if (ruleGroup.rules.length === 0) {
      return {};
    }

    return ruleGroup;
  }
}
