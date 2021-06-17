import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
export class AppComponent implements AfterViewInit {
  @ViewChild(QuerySearchComponent) querySearchComponent: QuerySearchComponent

  queryObject: QueryRuleGroup[] = [];
  version: string;
  githubRepo: string;

  observableValues: Observable<ProvidedValue[]>

  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.version = packageData.version;
    this.githubRepo = packageData.repository;

    this.querySearchService.consumeModel(Demo, {birthday: 'Birthday 2', count: 'Total Count', isActive: 'Active', name: 'Other Name'});

    this.observableValues = of([{displayValue: 'Value A', value: 'A'}, {displayValue: 'Value B', value: 'B'}]).pipe(
      delay(2000)
    )
  }

  ngAfterViewInit() {
  }
}
