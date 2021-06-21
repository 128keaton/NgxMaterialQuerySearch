import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {QueryItem} from "../../../models";

@Component({
  selector: 'operator-field',
  templateUrl: './operator-field.component.html',
  styleUrls: ['./operator-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class OperatorFieldComponent implements OnInit {

  @Input()
  item: QueryItem;

  @Output()
  operatorSelected = new EventEmitter<string>(true);

  operators: string[];
  operatorStyle = `
  position: absolute;
   right: 1em;
   color: gray
   `;

  constructor(private querySearchService: QuerySearchService) {
    this.operators = this.querySearchService.operators;
  }

  ngOnInit(): void {
  }

  get padDividers(): boolean {
    return this.querySearchService.formFieldAppearance !== 'outline';
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }
}
