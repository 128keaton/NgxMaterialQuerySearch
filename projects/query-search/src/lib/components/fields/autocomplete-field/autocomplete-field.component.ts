import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input, Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {QuerySearchService} from '../../../query-search.service';
import {ProvidedValue, QueryField, QueryItem} from '../../../models';
import {BehaviorSubject, fromEvent, Observable, of, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {
  handleRawValues,
  handleReturnValues,
  handleValueSelected,
  toggleValueSelection
} from '../../../helpers/values.helper';

@Component({
  selector: 'autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFieldComponent implements AfterViewInit {

  @ViewChildren('searchInput')
  searchInputs: QueryList<ElementRef>;

  @ViewChildren('valueInput')
  valueInputs: QueryList<ElementRef>;

  @Input()
  set item(newValue: QueryItem) {
    this.querySearchService.log('AutocompleteField - Item Changed:', newValue);
    this._item = newValue;
    this.setField();
    this.changeDetectorRef.detectChanges();
  }

  get item() {
    return this._item;
  }

  @Input()
  set multi(newValue: string | boolean) {
    this._multiSelect = `${newValue}` === 'true';
  }

  @Input()
  value: any;

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  values: Observable<any[]>;
  maxResults: number | undefined;
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  totalValues: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');

  visibleValues: Observable<any[]>;
  selectedValues: any[] = [];
  currentSearchValue = '';

  private _multiSelect = false;
  private _field: QueryField | null;
  private _item: QueryItem;
  private _loading = false;
  private _totalValues = 0;
  private _valuesObservable: Observable<any[]>;
  private _fieldValueSubscription: Subscription;

  constructor(private querySearchService: QuerySearchService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.maxResults = this.querySearchService.resultsLimit;
    this.$loading.subscribe(loading => this._loading = loading);
  }

  ngAfterViewInit() {
    this.setupInputValueFields(this.valueInputs.first);

    // Listen for input changes on an autocomplete input
    this.valueInputs.changes.subscribe((changes: QueryList<ElementRef>) => {
      if (!!changes) {
        this.setupInputValueFields(changes.first);
      }
    });
  }

  get isObservable(): boolean {
    if (!!this._field && !!this._field.values) {
      return this._field.values instanceof Observable;
    }

    return false;
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  searchValues(event: Event) {
    event.stopImmediatePropagation();
  }

  valueSelected(value: any | ProvidedValue) {
    return handleValueSelected(value, this.selectedValues);
  }

  /**
   * Handles mat-option div click
   *
   * @param event
   * @param value
   */
  optionClicked(event: Event, value: any) {
    this.querySearchService.log('AutocompleteField - Option Clicked:', value);
    event.stopPropagation();
    this.toggleSelection(value);
  }

  searchOptionClicked(event: Event) {
    event.stopImmediatePropagation();
  }

  toggleSelection(value: any | ProvidedValue) {
    this.selectedValues = toggleValueSelection(value, this.selectedValues, this.item.condition, this._multiSelect);

    if (this.selectedValues.length > 0) {
      this.value = this.selectedValues.join(',');
    } else {
      this.value = null;
    }

    this.changeDetectorRef.detectChanges();
    this.querySearchService.log('AutocompleteField - Toggle Selection:', this.value);
    this.valueChange.emit(this.value);
  }

  searchValueChanged(partialValue: string) {
    this.searchValue.next(partialValue);
  }

  clearSearch() {
    this.searchValueChanged('');
    if (!!this.searchInputs.first) {
      this.searchInputs.first.nativeElement.value = '';
    }
  }

  getValues(): Observable<any[] | ProvidedValue[]> {
    if (!!this._field && !!this._field.values) {
      if (this._field.values instanceof Observable) {
        return this._valuesObservable.pipe(
          tap(values => {
            this.totalValues.next(values.length);
          })
        );

      } else if (this._field.values.length > 0) {
        this.totalValues.next(this._field.values.length);

        return of(this._field.values).pipe(
          tap(() => this.$loading.next(false))
        );
      }
    }

    if (!!this._field && this._field.type === 'boolean') {
      const booleanValues = [
        {
          value: 'true',
          displayValue: 'True'
        },
        {
          value: 'false',
          displayValue: 'False'
        }
      ];

      this.totalValues.next(2);
      return of(booleanValues).pipe(
        shareReplay(1)
      );
    }

    this.totalValues.next(0);
    return of([]);
  }

  clear() {
    this.querySearchService.log('AutocompleteField - Clearing selected values');
    this.updateValue(null);
  }

  onScroll() {
    if (this.maxResults && this.maxResults < this._totalValues && !this._loading) {
      this.maxResults = this.maxResults + this.maxResults;
      // Set loading to true so if we have an observable it works right
      this.$loading.next(true);

      // Finally, setup our visibleValues observable
      this.setupVisibleValues();
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
      ).subscribe(inputValue => {
        this.processValuesSelected(inputValue);
      });
    }
  }

  private processValuesSelected(inputValue: string) {
    this.querySearchService.log('AutocompleteField - Process Values Selected', inputValue);
    if (!!inputValue && inputValue.length) {
      this.selectedValues = inputValue.split(',');
    } else {
      this.selectedValues = [];
    }

    this.querySearchService.log('AutocompleteField - Process Values Selected', this.selectedValues);
    this.changeDetectorRef.detectChanges();
  }

  private setField() {
    if (!!this.item && !!this.item.fieldName) {
      this._field = this.querySearchService.getField(this.item.fieldName);

      this.checkForObservable();
      this.resetValues();
    }
  }

  private resetValues() {
    this.querySearchService.log('AutocompleteField - Reset Values Called');
    let didSetSelected = false;

    if (!!this.item && !!this.item.value) {
      if (Array.isArray(this.item.value)) {
        this.querySearchService.log('AutocompleteField - Mapping values', this.item.value);
        this.selectedValues = this.item.value;
        didSetSelected = true;
      } else if (typeof this.item.value === 'string') {
        this.querySearchService.log('AutocompleteField - Mapping values', this.item.value);
        this.selectedValues = this.item.value.split(',');
        didSetSelected = true;
      }
    } else if (!!this.value && !didSetSelected) {
      if (Array.isArray(this.value)) {
        this.querySearchService.log('AutocompleteField - Mapping values', this.value);
        this.selectedValues = this.value;
        didSetSelected = true;
      } else if (typeof this.value === 'string') {
        this.querySearchService.log('AutocompleteField - Mapping values', this.value);
        this.selectedValues = this.value.split(',');
        didSetSelected = true;
      }
    }

    if (!didSetSelected) {
      this.selectedValues = [];
    }

    // Setup our values observable
    this.values = this.getValues();

    // Set loading to true so if we have an observable it works right
    this.$loading.next(true);

    // Finally, setup our visibleValues observable
    this.setupVisibleValues();

    // Detect changes
    this.changeDetectorRef.detectChanges();
  }

  private setupVisibleValues() {
    this.visibleValues = this.searchValue.pipe(
      startWith(null),
      switchMap(searchValue => this.values.pipe(
          map(rawValues => handleRawValues(rawValues, searchValue)),
        )),
      map(values => {
        if (!!this.maxResults &&
          values.length > this.maxResults &&
          (!this.currentSearchValue || this.currentSearchValue.trim().length === 0)) {
          this._totalValues = values.length;

          return handleReturnValues(values, this.maxResults);
        }

        return values;
      })
    );
  }


  private setupInputValueFields(field: ElementRef) {
    if (!!field) {
      this.setupFieldValueListener(field);
    }
  }

  private checkForObservable() {
    if (!!this._field && !!this._field.values && this._field.values instanceof Observable) {
      this._valuesObservable = this._field.values.pipe(
        tap(() => this.$loading.next(false))
      );
    }
  }

  private updateValue(value: any) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
