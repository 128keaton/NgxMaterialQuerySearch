import {QueryItem} from "./query-item.model";
import {QueryBase} from "./query-base.model";
import {QueryRuleGroup} from "./rules/query-rule-group.model";

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

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }

  addChild() {
    this.children.push(new QueryGroup(this.type, this.depth + 1));
  }

  removeChild(id: string) {
    this.children = this.children.filter(c => c.id !== id);
  }

  get filterValue (): QueryRuleGroup {
    const itemRules = this.items.map(i => i.filterValue).filter(i => i.valid);
    const childRules = this.children.map(i => i.filterValue).filter(i => !!i);

    return new QueryRuleGroup(this.type, [...itemRules, ...childRules]);
  }
}
