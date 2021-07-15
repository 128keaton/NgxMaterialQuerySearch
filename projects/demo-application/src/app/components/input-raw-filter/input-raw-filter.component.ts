import {Component, EventEmitter, Output} from '@angular/core';
import {SavedFilter} from 'ngx-mat-query-search';

@Component({
  selector: 'app-input-raw-filter',
  templateUrl: './input-raw-filter.component.html',
  styleUrls: ['./input-raw-filter.component.scss']
})
export class InputRawFilterComponent {

  @Output() generatedFilter = new EventEmitter<SavedFilter>();

  rawFilterJSON: string;
  currentObject: any = null;
  parseError: string | null = null;


  emitFilter() {
    try {
      const parsedJSON = JSON.parse(this.rawFilterJSON);
      let savedFilter: SavedFilter;

      if (parsedJSON.hasOwnProperty('ruleGroup')) {
        savedFilter = parsedJSON;
      } else {
        savedFilter = {
          name: 'Parsed Filter',
          ruleGroup: parsedJSON
        };
      }

      this.currentObject = parsedJSON;
      this.generatedFilter.emit(savedFilter);
    } catch (e) {
      this.parseError = `${e}`;
    }
  }
}
