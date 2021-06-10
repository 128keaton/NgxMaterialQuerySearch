import { EventEmitter } from '@angular/core';
import {Component, Input, OnInit, Output} from '@angular/core';
import {QueryItem} from "../../models";
import {QuerySearchService} from "../../query-search.service";

@Component({
  selector: 'query-search-item',
  templateUrl: './query-search-item.component.html',
  styleUrls: ['./query-search-item.component.scss']
})
export class QuerySearchItemComponent implements OnInit {

  @Input()
  item: QueryItem;

  @Output()
  removed = new EventEmitter<string>()

  fieldNames: string[];
  operators: string[];

  constructor(private querySearchService: QuerySearchService) {
    this.fieldNames = querySearchService.fieldNames;
    this.operators = querySearchService.operators;
  }

  ngOnInit(): void {
  }

  remove() {
    this.removed.emit(this.item.id);
  }
}
