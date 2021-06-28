import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  Input, OnChanges,
  Output,
  QueryList, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {QueryField, QueryItem} from "../../models";
import {QuerySearchService} from "../../query-search.service";
import {Observable} from "rxjs";
import {DateAdapter} from "@angular/material/core";
import {CustomDateAdapter} from "../../adapters";
import {DoubleDateFieldComponent} from "../fields/double-date-field/double-date-field.component";


@Component({
  selector: 'query-search-item',
  templateUrl: './query-search-item.component.html',
  styleUrls: ['./query-search-item.component.scss'],
  viewProviders: [
    {provide: DateAdapter, useClass: CustomDateAdapter}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuerySearchItemComponent {

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

  @ViewChild(DoubleDateFieldComponent, {static: false})
  doubleDateFieldComponent: DoubleDateFieldComponent;

  @HostBinding('class.double-height')
  doubleHeight = false;

  operators: string[];
  fields: Observable<QueryField[]>;
  selectedField: QueryField;
  showBetweenDateFields = false;
  operatorUpdated = new EventEmitter<any>(true);

  private _currentOperator: string;
  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService,
              private changeDetectorRef: ChangeDetectorRef,
              private dateAdapter: DateAdapter<any>) {
    this.operators = querySearchService.operators;
    this.fields = querySearchService.fields;
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

  get isBetweenDate(): boolean {
    if (!!this.selectedField && !!this._currentOperator) {
      return this.isDate && this._currentOperator === 'BETWEEN';
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


  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  get padDividers(): boolean {
    return this.querySearchService.formFieldAppearance !== 'outline';
  }

  get item(): QueryItem {
    return this._item;
  }

  get flagType() {
    return this.item.active ? 'flag' : 'outlined_flag';
  }

  get flagTooltip() {
    return this.item.active ? 'Active' : 'Inactive';
  }

  operatorSelected(operator: any) {
    this._currentOperator = operator;
    this.item.value = null;
    this.querySearchService.log('Clearing selected values for', this);
    this.operatorUpdated.emit(operator);
    this.configureDateField();
  }

  private configureDateField() {
    if (!!this.doubleDateFieldComponent) {
      this.changeDetectorRef.detectChanges();
      this.doubleDateFieldComponent.configure();
    } else if (this.showBetweenDateFields && !this.doubleHeight) {
      this.doubleHeight = true;
    }

    this.changeDetectorRef.detectChanges();
  }

  private loadFieldFromItem() {
    if (!!this.item && !!this.item.fieldName && !this.selectedField) {
      this.querySearchService.fields.subscribe(fields => {
        const field = fields.find(f => f.name === this.item.fieldName);
        if (!!field) {
          this.selectedField = field;
          this.item.type = field.type;

          if (this.item.condition) {
            this._currentOperator = this.item.condition;
            setTimeout(() => {
              this.configureDateField();
            }, 500);
          }

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
