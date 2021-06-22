import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {ProvidedValue, QueryField, QueryItem} from "../../../models";
import {BehaviorSubject, fromEvent, Observable, of, Subscription} from "rxjs";
import {distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from "rxjs/operators";


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
  item: QueryItem;

  @Input()
  set selectedField(field: QueryField) {
    this._selectedField = field;
    this.checkForObservable();
    this.resetValues();
  }

  get selectedField() {
    return this._selectedField;
  }

  values: Observable<any[]>;

  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  totalValues: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');

  visibleValues: Observable<any[]>;
  selectedValues: any[] = [];
  currentSearchValue: string = '';

  private _selectedField: QueryField;
  private _valuesObservable: Observable<any[]>;
  private _fieldValueSubscription: Subscription;

  constructor(private querySearchService: QuerySearchService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.setupInputValueFields(this.valueInputs.first);

    // Listen for input changes on an autocomplete input
    this.valueInputs.changes.subscribe((changes: QueryList<ElementRef>) => {
      if (!!changes) {
        this.setupInputValueFields(changes.first)
      }
    });
  }

  get isObservable(): boolean {
    if (!!this.selectedField && !!this.selectedField.values) {
      return this.selectedField.values instanceof Observable
    }

    return false;
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  get maxResults() {
    return this.querySearchService.resultsLimit;
  }

  searchValues(event: Event) {
    event.stopImmediatePropagation();
  }

  valueSelected(value: any | ProvidedValue) {
    if (value.hasOwnProperty('displayValue') && value.hasOwnProperty('value')) {
      return this.selectedValues.includes(value.value);
    }

    return this.selectedValues.includes(value);
  }

  /**
   * Handles mat-option div click
   * @param event
   * @param value
   */
  optionClicked(event: Event, value: any) {
    this.querySearchService.log('Option clicked', value);
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
    this.changeDetectorRef.detectChanges();
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
    if (!!this.selectedField && !!this.selectedField.values) {
      if (this.selectedField.values instanceof Observable) {
        return this._valuesObservable.pipe(
          tap(values => {
            this.totalValues.next(values.length);
          })
        )
      } else if (this.selectedField.values.length > 0) {
        this.totalValues.next(this.selectedField.values.length);
        return of(this.selectedField.values).pipe(
          tap(() => this.$loading.next(false))
        );
      }
    }

    if (this.selectedField.type === 'boolean') {
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
      )
    }

    this.totalValues.next(0);
    return of([]);
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

    this.changeDetectorRef.detectChanges();
  }

  private resetValues() {
    // Set the item value to null
    this.item.value = null;

    // Clear our selected values array
    this.selectedValues = [];

    // Setup our values observable
    this.values = this.getValues();

    // Set loading to true so if we have an observable it works right
    this.$loading.next(true);

    // Finally, setup our visibleValues observable
    this.setupVisibleValues();
  }

  private setupVisibleValues() {
    this.visibleValues = this.searchValue.pipe(
      startWith(null),
      switchMap(searchValue => {
        return this.values.pipe(
          map(rawValues => {
            const values = Object.assign([], rawValues);
            const lowerValue = (searchValue || '').trim().toLowerCase();

            if (lowerValue.length > 0) {
              return this.mapSearchValues(lowerValue, values)
            }

            return values;
          }),
        );
      }),
      map(values => {
        if (!!this.maxResults && values.length > this.maxResults && (!this.currentSearchValue || this.currentSearchValue.trim().length === 0)) {
          const returnedValues: any[] = [];
          values.forEach((value, index) => {
            if (index + 1 < (this.maxResults || 50)) {
              returnedValues.push(value);
            }
          });

          return [...new Set(returnedValues)];
        }

        return values;
      })
    )
  }

  /**
   * Filter through values to find items containing the search text
   * @param searchValue - Values to search for
   * @param values - Array of any or ProvidedValue
   * @private
   */
  private mapSearchValues(searchValue: string, values: any[]) {
    return values.filter(value => {
      if (value.hasOwnProperty('displayValue')) {
        if (value.hasOwnProperty('description') && value.description) {
          return value.value.toLowerCase().includes(searchValue) || value.displayValue.toLowerCase().includes(searchValue) || value.description.toLowerCase().includes(searchValue)
        }

        return value.value.toLowerCase().includes(searchValue) || value.displayValue.toLowerCase().includes(searchValue)
      }

      return `${value}`.toLowerCase().includes(searchValue);
    })
  }

  private setupInputValueFields(field: ElementRef) {
    if (!!field) {
      this.setupFieldValueListener(field);
    }
  }

  private checkForObservable() {
    if (!!this.selectedField && !!this.selectedField.values && this.selectedField.values instanceof Observable) {
      this._valuesObservable = this.selectedField.values.pipe(
        tap(() => this.$loading.next(false))
      )
    }
  }
}
