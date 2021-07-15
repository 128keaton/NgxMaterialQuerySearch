import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SavedFilter} from "ngx-mat-query-search";

@Component({
  selector: 'app-input-raw-filter',
  templateUrl: './input-raw-filter.component.html',
  styleUrls: ['./input-raw-filter.component.scss']
})
export class InputRawFilterComponent implements OnInit {

  @Output() generatedFilter = new EventEmitter<SavedFilter>();

  rawFilterJSON: string;

  constructor() { }

  ngOnInit(): void {
  }

  emitFilter() {
    const parsedJSON = JSON.parse(this.rawFilterJSON);
    const savedFilter: SavedFilter = {
      name: 'Parsed Filter',
      ruleGroup: parsedJSON
    };

    this.generatedFilter.emit(savedFilter);
  }
}
