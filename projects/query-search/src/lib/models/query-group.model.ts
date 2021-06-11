import {QueryItem} from "./query-item.model";
import {QueryBase} from "./query-base.model";

export class QueryGroup extends QueryBase {
  type: 'AND' | 'OR';
  items: QueryItem[] = [];
  children: QueryGroup[] = [];

  constructor(type: 'AND' | 'OR') {
    super();
    this.type = type;

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
    this.children.push(new QueryGroup(this.type));
  }

  removeChild(id: string) {
    this.children = this.children.filter(c => c.id !== id);
  }
}
