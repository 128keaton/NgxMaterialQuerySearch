import {EventEmitter} from '@angular/core';
import {Component, Input, OnInit, Output} from '@angular/core';
import {QueryItem, QueryField} from "../../models";
import {QuerySearchService} from "../../query-search.service";
import {Observable, of} from "rxjs";
import {DateAdapter} from "@angular/material/core";
import {CustomDateAdapter} from "../../adapters";

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
  set item(newValue: QueryItem) {
    this._item = newValue;
    this.loadFieldFromItem();
  }

  @Input()
  disableDelete = false;

  @Output()
  removed = new EventEmitter<string>();

  selectedValues: any[] = [];
  operators: string[];
  fields: Observable<QueryField[]>;
  selectedField: QueryField;
  operatorStyle = `
  position: absolute;
   right: 1em;
   color: gray
   `;

  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService, private dateAdapter: DateAdapter<any>) {
    this.operators = querySearchService.operators;
    this.fields = querySearchService.fields;
  }

  ngOnInit(): void {
  }

  remove() {
    this.querySearchService.log('Removing field item', this, this.selectedField);
    this.removed.emit(this.item.id);
  }


  fieldSelected(field: QueryField) {
    this.item.fieldName = field.name;
    this.item.type = field.type;
    this.querySearchService.log('Field selected', field);
    this.updateDateFormat();
    this.item.value = null;
  }

  get hasValues(): boolean {
    if (!!this.selectedField) {
      return !!this.selectedField.values;
    }

    return false;
  }

  get isDate(): boolean {
    if (!!this.selectedField) {
      return this.selectedField.type === 'date';
    }

    return false;
  }

  get isNumber() {
    if (!!this.selectedField) {
      return this.selectedField.type === 'number';
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

  get values(): Observable<any[]> {
    if (!!this.selectedField && !!this.selectedField.values) {
      if (this.selectedField.values instanceof Observable) {
        return this.selectedField.values;
      } else {
        return of(this.selectedField.values);
      }
    }

    return of([])
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

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  get padDividers(): boolean {
    return this.querySearchService.formFieldAppearance !== 'outline';
  }

  get item(): QueryItem {
    return this._item;
  }

  private loadFieldFromItem() {
    if (!!this.item && !!this.item.fieldName && !this.selectedField) {
      this.querySearchService.fields.subscribe(fields => {
        const field = fields.find(f => f.name === this.item.fieldName);
        if (!!field) {
          this.selectedField = field;
          this.item.type = field.type;
          this.querySearchService.log('Field loaded', field);
          this.updateDateFormat();
        }
      })
    }
  }

  private updateDateFormat() {
    if (!!this.selectedField && !!this.selectedField.format) {
      (this.dateAdapter as CustomDateAdapter).setFormat(this.selectedField.format);
    }
  }
}
