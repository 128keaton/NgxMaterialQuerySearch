import {Component, Input, OnInit} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {QueryItem} from "../../../models";

@Component({
  selector: 'plain-value-field',
  templateUrl: './plain-value-field.component.html',
  styleUrls: ['./plain-value-field.component.scss']
})
export class PlainValueFieldComponent implements OnInit {

  @Input()
  item: QueryItem;

  @Input()
  isNumber: boolean = false;

  constructor(private querySearchService: QuerySearchService) {}

  ngOnInit(): void {
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }
}
