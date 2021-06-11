import {Component, OnInit, Output} from '@angular/core';
import {QueryItem} from "./models";
import {RequestQueryBuilder, CondOperator, ComparisonOperator} from "@nestjsx/crud-request";
import { EventEmitter } from '@angular/core';
import {QueryGroup} from "./models/query-group.model";

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss']
})
export class QuerySearchComponent implements OnInit {

  groups: QueryGroup[] = [];

  @Output()
  queryUpdated = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  addItem() {
    const newItem = new QueryItem();
  //  this.items.push(newItem)
  }

  addGroup() {
    const newGroup = new QueryGroup('AND');
    this.groups.push(newGroup);
  }

  remove(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
  }

  generate() {
  /*  const qb = RequestQueryBuilder.create();
    this.items.filter(item => {
      return !!item.condition && !!item.fieldName
    }).forEach(item => {
      console.log(item.condition);

      if (item.condition === 'IN' || item.condition === 'NOT_IN') {
        console.log(`${item.value}`.split(','));
        qb.setFilter({field: item.fieldName, operator: (CondOperator as any)[item.condition], value: `${item.value}`.split(',')})
      } else {
        qb.setFilter({field: item.fieldName, operator: (CondOperator as any)[item.condition], value: item.value})
      }
    });

    this.queryUpdated.emit(qb.queryObject);*/
  }
}
