import {
  AfterViewInit,
  ElementRef,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Component, Input, Output} from '@angular/core';
import {QueryItem, QueryField} from "../../models";
import {QuerySearchService} from "../../query-search.service";
import {BehaviorSubject, fromEvent, Observable, of, Subscription} from "rxjs";
import {DateAdapter} from "@angular/material/core";
import {CustomDateAdapter} from "../../adapters";
import {debounceTime, distinctUntilChanged, filter, map, tap} from "rxjs/operators";

@Component({
  selector: 'query-search-item',
  templateUrl: './query-search-item.component.html',
  styleUrls: ['./query-search-item.component.scss'],
  viewProviders: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ]
})
export class QuerySearchItemComponent implements AfterViewInit {

  @Input()
  set item(newValue: QueryItem) {
    this._item = newValue;
    this.loadFieldFromItem();
  }

  @Input()
  disableDelete = false;

  @Output()
  removed = new EventEmitter<string>();


  @ViewChildren('valueInput')
  valueInputs: QueryList<ElementRef>;

  selectedValues: any[] = [];
  operators: string[];
  fields: Observable<QueryField[]>;
  selectedField: QueryField;
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  operatorStyle = `
  position: absolute;
   right: 1em;
   color: gray
   `;

  private _item: QueryItem;
  private _valuesObservable: Observable<any[]>;
  private _fieldValueSubscription: Subscription;

  constructor(private querySearchService: QuerySearchService, private dateAdapter: DateAdapter<any>) {
    this.operators = querySearchService.operators;
    this.fields = querySearchService.fields;
  }


  ngAfterViewInit() {
    this.valueInputs.changes.subscribe((changes: QueryList<ElementRef>) => {
      this.setupFieldValueListener(changes.first);
    });
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
    this.checkForObservable();
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
        return this._valuesObservable;
      } else {
        return of(this.selectedField.values)
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

  get isObservable(): boolean {
    if (!!this.selectedField && !!this.selectedField.values) {
      return this.selectedField.values instanceof Observable
    }

    return false;
  }

  operatorSelected() {
    setTimeout(this.setupFieldValueListener, 300);
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
          this.checkForObservable();
        }
      })
    }
  }

  private checkForObservable() {
    if (!!this.selectedField && !!this.selectedField.values && this.selectedField.values instanceof Observable) {
      this._valuesObservable = this.selectedField.values.pipe(
        tap(() => this.$loading.next(false))
      )
    }
  }

  private updateDateFormat() {
    if (!!this.selectedField && !!this.selectedField.format) {
      (this.dateAdapter as CustomDateAdapter).setFormat(this.selectedField.format);
    }
  }

  private setupFieldValueListener(field: ElementRef) {
    if (this._fieldValueSubscription) {
      this._fieldValueSubscription.unsubscribe();
    }

    if (!!field) {
      this._fieldValueSubscription = fromEvent(field.nativeElement, 'keyup').pipe(
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        map(() => field.nativeElement.value)
      ).subscribe(inputValue => this.querySearchService.valueFieldChanged(this.selectedField, inputValue));
    }
  }
}
