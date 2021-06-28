import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QueryItem} from "../../../models";
import {QuerySearchService} from "../../../query-search.service";
import {transformToDate} from "../../../helpers/query-search.helpers";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'double-date-field',
  templateUrl: './double-date-field.component.html',
  styleUrls: ['./double-date-field.component.scss'],
  animations: [
    trigger('bottomField', [
      state('in', style({ height: 'auto' })),
      transition('void => *', [
        style({ height: 0 }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ height: 0 }))
      ])
    ]),
  ]
})
export class DoubleDateFieldComponent {

  @Input()
  item: QueryItem;

  @Output()
  itemChange: EventEmitter<QueryItem> = new EventEmitter<QueryItem>();

  @Input()
  isBetweenDate: boolean = true;

  @Input()
  doubleHeight: boolean;

  @Output()
  doubleHeightChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  showBetweenDateFields: boolean;

  @Output()
  showBetweenDateFieldsChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  leftDate: Date;
  rightDate: Date;

  constructor(private querySearchService: QuerySearchService) {}

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  betweenDateUpdated() {
    this.item.value = [this.leftDate, this.rightDate];
    this.querySearchService.log('Date updated', this.leftDate, this.rightDate);
    this.querySearchService.log('Formatted date', this.item.value);
  }

  public configure() {
    this.querySearchService.log('Configuring date field. Is between date:', this.isBetweenDate, this.item);

    if (this.isBetweenDate) {
      this.doubleHeight = true;
      this.showBetweenDateFields = true;

      this.doubleHeightChange.emit(true);
      this.showBetweenDateFieldsChange.emit(true);

      if (this.item.value) {
        const dateStrings = transformToDate(this.item.value);
        if (dateStrings instanceof Array) {
          const leftDateString = dateStrings[0];
          const rightDateString = dateStrings[1];

          if (!!leftDateString) {
            this.leftDate = new Date(leftDateString);
          }

          if (!!rightDateString) {
            this.rightDate = new Date(rightDateString);
          }
        }
      }
    } else {
      this.doubleHeight = false;
      this.showBetweenDateFields = false;
      this.doubleHeightChange.emit(false);
      this.showBetweenDateFieldsChange.emit(false);
    }
  }

}
