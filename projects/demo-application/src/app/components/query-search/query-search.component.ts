import {Component, ViewChild} from '@angular/core';
import {Demo} from '../../demo.model';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {
  QuerySearchService,
  QuerySearchComponent as ExportedQuerySearchComponent,
  ProvidedValue,
  QueryRuleGroup,
  ConditionOperator,
  SavedFilter,
} from 'ngx-mat-query-search';
import * as generate from 'project-name-generator';
import {MatTabGroup} from '@angular/material/tabs';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-query-search',
  templateUrl: './query-search.component.html',
  styleUrls: ['./query-search.component.scss']
})
export class QuerySearchComponent {

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  @ViewChild(ExportedQuerySearchComponent) querySearchComponent: ExportedQuerySearchComponent;

  queryObject: QueryRuleGroup[] | null = null;
  currentFilter?: SavedFilter | null = null;
  observableValues: Observable<ProvidedValue[]>;

  constructor(private querySearchService: QuerySearchService,
              private clipboard: Clipboard) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => {
      this.queryObject = newQueryObject;
      this.matTabGroup.focusTab(1);
    });


    this.querySearchService.consumeModel(Demo, {
      count: 'Total Count',
      isActive: 'Active',
      name: 'Other Name'
    });

    const alphabet = 'abcdefghijklmnopqrstuvwxyz123456789';
    const values = alphabet.split('').map(letter => ({
        displayValue: `Value ${letter.toUpperCase()}`,
        value: letter.toUpperCase(),
        description: `This is value ${letter.toUpperCase()}`
      }));

    this.observableValues = of(values).pipe(
      delay(2000)
    );
  }

  loadDemoFilter() {
    const demoFilter: SavedFilter = {
      name: 'Test Filter',
      ruleGroup: {
        condition: 'AND',
        rules: [
          {
            field: 'fullName',
            operator: ConditionOperator.EQUALS,
            value: 'Grant',
          },
          {
            field: 'slow',
            operator: ConditionOperator.IN,
            value: 'A,B,C,D',
          },
          {
            field: 'birthday',
            operator: ConditionOperator.BETWEEN,
            value: ['06/21/2019', '06/21/2021'],
            type: 'date'
          }
        ]
      }
    };

    this.querySearchComponent.loadSavedFilter(demoFilter);
  }

  filterLoaded(filter: SavedFilter) {
    this.currentFilter = filter;
  }

  deleteFilter() {
    // This is where you would do your deletion logic
    this.querySearchComponent.clearSavedFilter();
  }

  saveFilter() {
    // This is where you would do your saving logic, saving the filter from the generation method
    const newFilter = this.querySearchComponent.generateSavedFilter(generate().spaced + ' Filter');

    if (!!newFilter) {
      this.querySearchComponent.filterSaved(newFilter);
    }
  }

  get hasFilter() {
    return !!this.currentFilter;
  }

  provideParsedFilter(filter: SavedFilter) {
    this.matTabGroup.focusTab(0);
    this.querySearchComponent.loadSavedFilter(filter);
  }

  copyFilterOutput() {
    if (!!this.currentFilter) {
      this.clipboard.copy(JSON.stringify(this.currentFilter));
    }
  }

  copyQueryOutput() {
    if (!!this.queryObject) {
      this.clipboard.copy(JSON.stringify(this.queryObject));
    }
  }
}
