import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QueryItem} from "../../../models";
import {QuerySearchService} from "../../../query-search.service";

@Component({
  selector: 'single-date-field',
  templateUrl: './single-date-field.component.html',
  styleUrls: ['./single-date-field.component.scss']
})
export class SingleDateFieldComponent {

  @Input()
  item: QueryItem;

  @Output()
  itemChange: EventEmitter<QueryItem> = new EventEmitter<QueryItem>();


  constructor(private querySearchService: QuerySearchService) {}

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  dateUpdated(newDate: Date) {
    this.querySearchService.log('Date updated', newDate);
    this.querySearchService.log('Formatted date', this.item.value);
  }
}
