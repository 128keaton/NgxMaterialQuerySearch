import {QueryItem} from "./query-item.model";
import {QueryBase} from "./query-base.model";

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

  get filterValue () {
    const filterObject: any = {};
    const rawType = this.type === 'AND' ? '$and' : '$or';

    filterObject[rawType] = [...this.items.map(i => i.filterValue).filter(v => !!v), ...this.children.map(i => i.filterValue)];

    return filterObject;
  }
}
