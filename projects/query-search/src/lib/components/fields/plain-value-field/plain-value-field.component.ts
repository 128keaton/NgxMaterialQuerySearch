import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";

@Component({
  selector: 'plain-value-field',
  templateUrl: './plain-value-field.component.html',
  styleUrls: ['./plain-value-field.component.scss']
})
export class PlainValueFieldComponent {

  @Input()
  value: any;

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  isNumber: boolean = false;

  @Input()
  maxLength: number | undefined

  constructor(private querySearchService: QuerySearchService) {}

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  clear() {
    this.value = null;
    this.valueChange.emit(null);
  }
}
