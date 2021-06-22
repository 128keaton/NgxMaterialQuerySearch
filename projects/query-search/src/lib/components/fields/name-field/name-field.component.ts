import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {BehaviorSubject, Observable} from "rxjs";
import {QueryField} from "../../../models";
import {map, startWith, switchMap} from "rxjs/operators";

@Component({
  selector: 'name-field',
  templateUrl: './name-field.component.html',
  styleUrls: ['./name-field.component.scss']
})
export class NameFieldComponent {
  @Output()
  selectedFieldChange = new EventEmitter<QueryField>(true);

  @Input()
  selectedField: QueryField;

  allFields: Observable<QueryField[]>;
  visibleFields: Observable<QueryField[]>;
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  nameFieldTrigger: string;

  constructor(private querySearchService: QuerySearchService) {
    this.allFields = querySearchService.fields;
    this.visibleFields = this.searchValue.pipe(
      startWith(null),
      switchMap(searchValue => {
        return this.allFields.pipe(
          map(fields => {
            if (!!searchValue && searchValue.trim().length > 0) {
              return fields.filter(f => f.name.toLowerCase().includes(searchValue))
            }
            return fields;
          })
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

  fieldChanged(event: QueryField) {
    this.selectedFieldChange.emit(event);

    if (this.querySearchService.showFieldNameSuffix) {
      this.nameFieldTrigger = `<span class="field-name">${event.label || event.name}</span><span class="field-suffix">Name</span>`;
    } else {
      this.nameFieldTrigger = `<span class="field-name">${event.label || event.name}</span>`;
    }
  }
}
