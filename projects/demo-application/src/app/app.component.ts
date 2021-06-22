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

    let alphabet = 'abcdefghijklmnopqrstuv';
    let values = alphabet.split('').map(letter => {
      return {
        displayValue: `Value ${letter.toUpperCase()}`,
        value: letter.toUpperCase(),
        description: `This is value ${letter.toUpperCase()}`
      }
    });

    this.observableValues = of(values).pipe(
      delay(2000)
    )
  }
}
