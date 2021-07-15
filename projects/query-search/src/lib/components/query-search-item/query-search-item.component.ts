import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {QueryField, QueryItem} from '../../models';
import {QuerySearchService} from '../../query-search.service';
import {Observable} from 'rxjs';
import {DateAdapter} from '@angular/material/core';
import {CustomDateAdapter} from '../../adapters';
import {isBetweenOperator, isNullOperator} from '../../helpers/condition.helper';
import {StackedFieldComponent} from '../fields/stacked-field/stacked-field.component';
import {SingleFieldComponent} from '../fields/single-field/single-field.component';

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

  @Output()
  markChanged = new EventEmitter<QueryItem>();

  @Input()
  set item(newValue: QueryItem) {
    this._item = newValue;
    this.querySearchService.log('QuerySearchItem - Set Item', newValue);
    this.loadFieldFromItem();
    this.doubleHeight = isBetweenOperator(newValue.condition);
    this.changeDetectorRef.detectChanges();
  }

  get item(): QueryItem {
    return this._item;
  }

  @Input()
  disableDelete = false;

  @Output()
  removed = new EventEmitter<string>();

  @ViewChildren(StackedFieldComponent)
  stackedFields: QueryList<StackedFieldComponent>;

  @ViewChildren(SingleFieldComponent)
  singleFields: QueryList<SingleFieldComponent>;

  @HostBinding('class.double-height')
  doubleHeight = false;

  operators: string[];
  fields: Observable<QueryField[]>;

  private _currentField: QueryField;
  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService,
              private changeDetectorRef: ChangeDetectorRef,
              private dateAdapter: DateAdapter<any>) {
    this.operators = querySearchService.operators;
    this.fields = querySearchService.fields;
  }

  remove(emit: boolean = true) {
    this.querySearchService.log('QuerySearchItem - Removing Self', this);
    if (emit) {
      this.removed.emit(this.item.id);
    }
  }

  get showValueField(): boolean {
    if (!!this.item) {
      return !!this._item.condition && !isNullOperator(this._item.condition) && !!this._item.fieldName;
    }

    return false;
  }

  get isStackedField() {
    if (!!this.item) {
      return isBetweenOperator(this.item.condition);
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

  get flagType() {
    return this.item.active ? 'flag' : 'outlined_flag';
  }

  get flagTooltip() {
    return this.item.active ? 'Active' : 'Inactive';
  }

  fieldChanged() {
    this.markChanged.emit(this._item);
  }

  private loadFieldFromItem() {
    if (!!this.item && !!this.item.fieldName) {
      this.querySearchService.fields.subscribe(fields => {
        const field = fields.find(f => f.name === this.item.fieldName);
        if (!!field && this._currentField !== field) {
          this._currentField = field;

          this.item.type = field.type;
          this.item.fieldName = field.name;

          this.querySearchService.log('QuerySearchItem - Field Loaded:', field);
          this.updateDateFormat(field.format);
          this.updateFields(false);
        } else {
          // I know I'm using console here, but its for a good reason
          console.warn(`Could not find field with fieldName '${this.item.fieldName}'`, this);
        }
      });
    }
  }

  private updateDateFormat(format: string | undefined) {
    if (!!format) {
      (this.dateAdapter as CustomDateAdapter).setFormat(format);
    }

    this.changeDetectorRef.detectChanges();
  }

  private updateFields(emit: boolean = true) {
    [...(this.singleFields || []), ...(this.stackedFields || [])].forEach(field => {
      if (field.item !== this.item || field.item.fieldName !== this.item.fieldName || field.item.type !== this.item.type) {
        field.item = this.item;
      }

      field.itemUpdated(emit);
    });
  }
}
