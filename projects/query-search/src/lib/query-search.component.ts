import {Component, OnInit, Output} from '@angular/core';
import {QueryItem} from "./models";
import {RequestQueryBuilder, CondOperator, ComparisonOperator} from "@nestjsx/crud-request";
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss']
})
export class QuerySearchComponent implements OnInit {

  items: QueryItem[] = [];

  @Output()
  queryUpdated = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  addItem() {
    const newItem = new QueryItem();
    this.items.push(newItem)
  }

  remove(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }

  generate() {
    const qb = RequestQueryBuilder.create();
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

    this.queryUpdated.emit(qb.queryObject);
  }
}
