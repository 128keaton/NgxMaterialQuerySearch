import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {BehaviorSubject, Observable} from "rxjs";
import {QueryField, QueryItem} from "../../../models";
import {map, startWith, switchMap} from "rxjs/operators";
import {filterFieldNames, getFieldType} from "../../../helpers/general.helpers";

@Component({
  selector: 'name-field',
  templateUrl: './name-field.component.html',
  styleUrls: ['./name-field.component.scss']
})
export class NameFieldComponent {

  @Input()
  set item(newValue: QueryItem) {
    if (!!newValue) {
      this._item = newValue;
      if (!!this._item.fieldName) {
        this.fieldChanged(this._item.fieldName, false);
      }
    }
  }

  get item() {
    return this._item;
  }

  @Output()
  itemChange: EventEmitter<QueryItem> = new EventEmitter<QueryItem>();

  allFields: Observable<QueryField[]>;
  visibleFields: Observable<QueryField[]>;
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  nameFieldTrigger: string;

  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService,
              public changeDetectorRef: ChangeDetectorRef) {
    this.allFields = querySearchService.fields;
    this.visibleFields = this.searchValue.pipe(
      startWith(null),
      switchMap(searchValue => {
        return this.allFields.pipe(
          map(fields => filterFieldNames(searchValue, fields))
        )
      })
    )
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  searchValueChanged(searchValue: string) {
    this.searchValue.next(searchValue);
  }

  fieldChanged(event: string, emit = true) {
    const field = this.querySearchService.getField(event);

    if (!!field) {
      if (this.item.type !== field.type || this.item.fieldName !== field.name) {
        this.item.value = null;
      }

      this.item.type = field.type;
      this.item.fieldName = field.name;

      if (emit) {
        this.querySearchService.log('NameFieldComponent - Emitting Change:', field)
        this.itemChange.emit(this.item);
      } else {
        this.querySearchService.log('NameFieldComponent - Not Emitting Change:', field);
      }

      if (this.querySearchService.showFieldNameSuffix) {
        this.nameFieldTrigger = `<span class="field-name">${field.label || field.name}</span><span class="field-suffix">${getFieldType(field)}</span>`;
      } else {
        this.nameFieldTrigger = `<span class="field-name">${field.label || field.name}</span>`;
      }

      this.changeDetectorRef.detectChanges();
    }
  }
}
