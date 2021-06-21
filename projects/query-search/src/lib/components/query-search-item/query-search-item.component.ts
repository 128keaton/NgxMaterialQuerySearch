import {
  AfterViewInit,
  ElementRef,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Component, Input, Output} from '@angular/core';
import {QueryItem, QueryField, ProvidedValue} from "../../models";
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

  @ViewChildren('searchInput')
  searchInputs: QueryList<ElementRef>;

  allValues: any[] | ProvidedValue[] = [];
  visibleValues: any[] | ProvidedValue[] = [];
  searchValue: string = '';
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
    // Listen for input changes on an autocomplete input
    this.valueInputs.changes.subscribe((changes: QueryList<ElementRef>) => {
      this.setupFieldValueListener(changes.first);
    });

    // Remove the stupid ripple
    this.searchInputs.changes.subscribe((changes: QueryList<ElementRef>) => {
      const matOption = changes.first.nativeElement.parentElement.parentElement.parentElement
      const matRipple = matOption.querySelector('.mat-ripple');

      if (!!matRipple) {
        matRipple.remove();
      }
    })
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

  get values(): Observable<any[] | ProvidedValue[]> {
    if (!!this.selectedField && !!this.selectedField.values) {
      if (this.selectedField.values instanceof Observable) {
        return this._valuesObservable.pipe(
          tap(values => this.updateValues(values))
        )
      } else {
        this.updateValues(this.selectedField.values);
        return of(this.selectedField.values)
      }
    }

    return of([])
  }

  dateUpdated(newDate: Date) {
    this.querySearchService.log('Date updated', newDate);
    this.querySearchService.log('Formatted date', this.item.value);
  }

  valueSelected(value: any | ProvidedValue) {
    if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
      return this.selectedValues.includes(value.value);
    }

    return this.selectedValues.includes(value);
  }

  optionClicked(event: Event, value: any) {
    event.stopPropagation();
    this.toggleSelection(value);
  }

  searchOptionClicked(event: Event) {
    event.stopImmediatePropagation();
  }

  toggleSelection(value: any | ProvidedValue) {
    if (!this.valueSelected(value)) {
      if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
        this.selectedValues.push(value.value);
      } else {
        this.selectedValues.push(value)
      }
    } else {
      if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
        this.selectedValues = this.selectedValues.filter(v => v !== value.value);
      } else {
        this.selectedValues = this.selectedValues.filter(v => v !== value);
      }
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

  searchValues(event: Event) {
    event.stopImmediatePropagation();
  }

  searchValueChanged(partialValue: string) {
    if (partialValue.trim().length) {
      this.visibleValues = this.allValues.filter((value: any | ProvidedValue) => {
        const lowerValue = partialValue.toLowerCase();
        if (value.hasOwnProperty('displayValue')) {
          if (value.hasOwnProperty('description') && value.description) {
            return value.value.toLowerCase().includes(lowerValue) || value.displayValue.toLowerCase().includes(lowerValue) || value.description.toLowerCase().includes(lowerValue)
          }

          return value.value.toLowerCase().includes(lowerValue) || value.displayValue.toLowerCase().includes(lowerValue)
        }

        return `${value}`.includes(lowerValue);
      })
    } else {
      this.visibleValues = this.allValues;
    }
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
        distinctUntilChanged(),
        map(() => field.nativeElement.value),
        tap(inputValue => this.processValuesSelected(inputValue)),
        debounceTime(300),
      ).subscribe(inputValue => {
        this.querySearchService.valueFieldChanged(this.selectedField, inputValue);
      });
    }
  }

  private processValuesSelected(inputValue: string) {
    if (!!inputValue && inputValue.length) {
      this.selectedValues = inputValue.split(',');
    } else {
      this.selectedValues = [];
    }
  }

  private updateValues(values: any[] | ProvidedValue[]) {
    if (this.searchValue.length === 0) {
      this.visibleValues = values;
    }

    this.allValues = values;
  }
}
