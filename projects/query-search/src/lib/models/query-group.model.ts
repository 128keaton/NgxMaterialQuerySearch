import {QueryItem} from "./query-item.model";
import {QueryBase} from "./query-base.model";
import {QueryRule, QueryRuleGroup} from "./rules";
import {ConditionOperator} from "../enums";

export class QueryGroup extends QueryBase {
  type: 'AND' | 'OR';
  items: QueryItem[] = [];
  children: QueryGroup[] = [];

  constructor(type: 'AND' | 'OR', depth: number = 0) {
    super();
    this.type = type;
    this.depth = depth;

    if (this.items.length === 0 && this.children.length === 0) {
      this.addItem();
    }
  }

  addItem() {
    this.items.push(new QueryItem());
  }

  loadItem(fieldName: string, operator: ConditionOperator, value: any) {
    if (this.items.length === 1 && !this.items[0].fieldName) {
      this.items = [QueryItem.apply(fieldName, operator,value)];
    } else {
      this.items.push(QueryItem.apply(fieldName, operator,value));
    }
  }

  applyRule(rule: QueryRule) {
    const newItem = new QueryItem();
    newItem.condition = (rule.operator as ConditionOperator)
    newItem.fieldName = rule.field || 'unknown';
    newItem.type = rule.type || 'string';
    newItem.value = rule.value;
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
      return {}
    }

    return ruleGroup;
  }
}
