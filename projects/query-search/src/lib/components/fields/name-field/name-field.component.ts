import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {Observable} from "rxjs";
import {QueryField} from "../../../models";

@Component({
  selector: 'name-field',
  templateUrl: './name-field.component.html',
  styleUrls: ['./name-field.component.scss']
})
export class NameFieldComponent implements OnInit {
  @Output()
  selectedFieldChange = new EventEmitter<QueryField>(true);

  @Input()
  selectedField: QueryField;

  fields: Observable<QueryField[]>;

  constructor(private querySearchService: QuerySearchService) {
    this.fields = querySearchService.fields;
  }

  ngOnInit(): void {
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }
}
