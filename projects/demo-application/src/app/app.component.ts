import {Component, ViewChild} from '@angular/core';
import {
  QuerySearchService,
  QuerySearchComponent,
  ProvidedValue,
  QueryRuleGroup,
  ConditionOperator
} from "ngx-mat-query-search";
import packageData from '../../../query-search/package.json';
import {Demo} from "./demo.model";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(QuerySearchComponent) querySearchComponent: QuerySearchComponent

  queryObject: QueryRuleGroup[] = [];
  version: string;
  githubRepo: string;

  observableValues: Observable<ProvidedValue[]>

  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.version = packageData.version;
    this.githubRepo = packageData.repository;

    this.querySearchService.consumeModel(Demo, {
      birthday: 'Birthday 2',
      count: 'Total Count',
      isActive: 'Active',
      name: 'Other Name'
    });

    let alphabet = 'abcdefghijklmnopqrstuvwxyz123456789';
    let values = alphabet.split('').map(letter => {
      return {
        displayValue: `Value ${letter.toUpperCase()}`,
        value: letter.toUpperCase(),
        description: `This is value ${letter.toUpperCase()}`
      }
    });

    this.querySearchService.provideSavedFilters([
      {
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
              value: ['06/21/2019','06/21/2021'],
              type: 'date'
            }
          ]
        }
      }
    ]);

    this.observableValues = of(values).pipe(
      delay(2000)
    )
  }
}
