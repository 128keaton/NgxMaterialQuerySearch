import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuerySearchService} from '../../../query-search.service';

@Component({
  selector: 'date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent {
  @Input()
  value: Date;

  @Output()
  valueChange: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private querySearchService: QuerySearchService) {
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }
}
