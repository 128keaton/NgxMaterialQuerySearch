import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QueryGroup} from "../../models/query-group.model";
import {QueryItem} from "../../models";

@Component({
  selector: 'query-search-group',
  templateUrl: './query-search-group.component.html',
  styleUrls: ['./query-search-group.component.scss']
})
export class QuerySearchGroupComponent implements OnInit {

  @Input()
  group: QueryGroup;

  @Output()
  removed = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }


  addItem() {
    const newItem = new QueryItem();
    this.group.items.push(newItem);
  }

  addGroup() {
    const newGroup = new QueryGroup('AND');
    this.group.children.push(newGroup)
  }

  removeItem(id: string) {
    this.group.removeItem(id);
  }

  removeChild(id: string) {
    this.group.removeChild(id);
  }

  remove() {
    this.removed.emit(this.group.id);
  }
}
