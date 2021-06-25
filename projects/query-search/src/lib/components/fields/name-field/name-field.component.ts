import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {BehaviorSubject, Observable} from "rxjs";
import {QueryField} from "../../../models";
import {map, startWith, switchMap} from "rxjs/operators";
import {filterFieldNames, getFieldType} from "../../../helpers/query-search.helpers";

@Component({
  selector: 'name-field',
  templateUrl: './name-field.component.html',
  styleUrls: ['./name-field.component.scss']
})
export class NameFieldComponent {
  @Output()
  selectedFieldChange = new EventEmitter<QueryField>(true);

  @Input()
  set selectedField(newValue: QueryField) {
    if (!!newValue) {
      this._selectedField = newValue;
      this.fieldChanged(newValue, false);
    }
  }

  get selectedField() {
    return this._selectedField;
  }

  allFields: Observable<QueryField[]>;
  visibleFields: Observable<QueryField[]>;
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  nameFieldTrigger: string;

  private _selectedField: QueryField;

  constructor(private querySearchService: QuerySearchService) {
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

  fieldChanged(event: QueryField, emit = true) {
    if (emit) {
      this.selectedFieldChange.emit(event);
    }

    this.querySearchService.log('Name field - fieldChanged', event);
    if (this.querySearchService.showFieldNameSuffix) {
      this.nameFieldTrigger = `<span class="field-name">${event.label || event.name}</span><span class="field-suffix">${getFieldType(event)}</span>`;
    } else {
      this.nameFieldTrigger = `<span class="field-name">${event.label || event.name}</span>`;
    }
  }
}
