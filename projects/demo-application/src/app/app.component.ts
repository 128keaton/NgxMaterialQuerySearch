import {Component, ViewChild} from '@angular/core';
import {QuerySearchService, QuerySearchComponent, ProvidedValue, QueryRuleGroup} from "ngx-mat-query-search";
import packageData from '../../../query-search/package.json';
import {Demo} from "./demo.model";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
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

    this.observableValues = of([
      {
        displayValue: 'Value A',
        value: 'A',
        description: 'This isn\'t very long'
      },
      {
        displayValue: 'Value B',
        value: 'B',
        description: 'This is kinda long, but only kinda'
      },
      {
        displayValue: 'Value 1',
        value: '1',
        description: 'This is kinda long, but only kinda. Actually, never mind, its very long. I am writing this because I need a long string here to test. But who knows? I could be typing forever!'
      }
    ]).pipe(
      delay(2000)
    )
  }
}
