import {EventEmitter, HostBinding} from '@angular/core';
import {Component, Input, OnInit, Output} from '@angular/core';
import {QueryItem, QueryField} from "../../models";
import {QuerySearchService} from "../../query-search.service";
import {Observable} from "rxjs";
import {DateAdapter} from "@angular/material/core";
import {CustomDateAdapter} from "../../adapters/custom-date.adapter";

@Component({
  selector: 'query-search-item',
  templateUrl: './query-search-item.component.html',
  styleUrls: ['./query-search-item.component.scss'],
  viewProviders: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class QuerySearchItemComponent implements OnInit {

  @Input()
  item: QueryItem;

  @Input()
  disableDelete = false;

  @Output()
  removed = new EventEmitter<string>();

  @HostBinding('class.collapsed') collapsed: boolean = false;

  selectedValues: any[] = [];
  operators: string[];
  fields: Observable<QueryField[]>;
  selectedField: QueryField;
  operatorStyle = `
  position: absolute;
   right: 1em;
   color: gray
   `;

  constructor(private querySearchService: QuerySearchService, private dateAdapter: DateAdapter<any>) {
    this.operators = querySearchService.operators;
    this.fields = querySearchService.fields;
  }

  ngOnInit(): void {
  }

  remove() {
    this.collapsed = true;
    this.querySearchService.log('Removing field item', this, this.selectedField);
    setTimeout(() => this.removed.emit(this.item.id), 50);
  }

  fieldSelected(field: QueryField) {
    this.item.fieldName = field.name;
    this.item.type = field.type;
    this.querySearchService.log('Field selected', field);
    this.updateDateFormat();
  }

  get hasValues(): boolean {
    if (!!this.selectedField) {
      return !!this.selectedField.values && this.selectedField.values.length > 0;
    }

    return false;
  }

  get isDate(): boolean {
    if (!!this.selectedField) {
      return this.selectedField.type === 'date';
    }

    return false;
  }

  get showValueField(): boolean {
    if (!!this.item && !!this.item.condition) {
      return !this.item.condition.toLowerCase().includes('null');
    }

    return false;
  }

  get showOperatorField(): boolean {
    if (!!this.item) {
      return !!this.item.fieldName;
    }

    return false;
  }

  get values(): any[] {
    if (!!this.selectedField && !!this.selectedField.values) {
      return this.selectedField.values;
    }

    return [];
  }

  dateUpdated(newDate: Date) {
    this.querySearchService.log('Date updated', newDate);
    this.querySearchService.log('Formatted date', this.item.value);
  }

  valueSelected(value: any) {
    return this.selectedValues.includes(value);
  }

  optionClicked(event: Event, value: any) {
    event.stopPropagation();
    this.toggleSelection(value);
  }

  toggleSelection(value: any) {
    if (!this.valueSelected(value)) {
      this.selectedValues.push(value)
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== value);
    }

    this.item.value = this.selectedValues.join(',');
  }

  private updateDateFormat() {
    if (!!this.selectedField && !!this.selectedField.format) {
      (this.dateAdapter as CustomDateAdapter).setFormat(this.selectedField.format);
    }
  }
}
