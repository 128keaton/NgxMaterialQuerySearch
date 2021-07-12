import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output, QueryList,
  ViewChildren
} from '@angular/core';
import {QueryItem} from "../../../models";
import {QuerySearchService} from "../../../query-search.service";
import {AutocompleteFieldComponent} from "../autocomplete-field/autocomplete-field.component";

@Component({
  selector: 'single-field',
  templateUrl: './single-field.component.html',
  styleUrls: ['./single-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleFieldComponent {

  @Input()
  set item(newValue: QueryItem) {
    if (!!newValue) {
      this.querySearchService.log('SingleFieldComponent - Item Changed', newValue);
      this._item = newValue;
      this.itemUpdated();
    }
  }

  get item() {
    return this._item;
  }

  @Output()
  itemChange: EventEmitter<QueryItem> = new EventEmitter<QueryItem>();

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChildren(AutocompleteFieldComponent)
  autocompleteFields: QueryList<AutocompleteFieldComponent>

  maxLength: number | undefined;
  operator: string;
  type: string = 'string';
  hasValues: boolean = false;
  multi = false;

  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService,
              public changeDetectorRef: ChangeDetectorRef) {
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  get isString() {
    return (this.item.type || 'string') === 'string';
  }

  get isNumber() {
    return this.item.type === 'number';
  }

  get isBoolean() {
    return this.item.type === 'boolean';
  }

  get isDate() {
    return this.item.type === 'date';
  }

  get showAutocompleteField() {
    return this.isBoolean || this.hasValues;
  }

  get showPlainValueField() {
    return (this.isNumber || this.isString) && !this.hasValues && !this.isDate && !this.isBoolean;
  }

  get showDateField() {
    return this.isDate && !this.hasValues;
  }

  valueChanged(value: any) {
    this._item.value = value;
    this.itemChange.emit(this._item);
    this.valueChange.emit(this._item.value);
  }

  public itemUpdated() {
    this.setType();
    this.setOperator();
    this.setHasValues();
    this.setMaxLength();
    this.changeDetectorRef.detectChanges();
    this.updateFields();
  }

  private setType() {
    this.type = this._item.type || 'string';
  }

  private setOperator() {
    const multiValueOperators = [
      'IN',
      'NOT_IN'
    ];

    this.operator = this.item.condition;
    this.multi = multiValueOperators.includes(this.operator);
  }

  private setMaxLength() {
    if (!!this.item && !!this._item.fieldName) {
      this.maxLength = this.querySearchService.getFieldMaxLength(this._item.fieldName);
    }
  }

  private setHasValues() {
    if (!!this._item && !!this._item.fieldName) {
      this.hasValues = this.querySearchService.checkForValues(this._item.fieldName)
    } else {
      this.hasValues = false;
    }

    this.querySearchService.log('SingleFieldComponent - Has Values:', this.hasValues);
  }

  private updateFields() {
    (this.autocompleteFields || []).forEach(field => {
        field.item = this.item;
    })
  }
}
