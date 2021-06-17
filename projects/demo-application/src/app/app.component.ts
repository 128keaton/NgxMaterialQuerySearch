import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {QuerySearchService, QuerySearchComponent, ConditionOperator} from "ngx-mat-query-search";
import packageData from '../../../query-search/package.json';
import {Demo} from "./demo.model";
import {QueryRuleGroup} from "../../../query-search/src/lib/models";
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

  observableValues: Observable<string[]>

  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.version = packageData.version;
    this.githubRepo = packageData.repository;

    this.querySearchService.consumeModel(Demo, {birthday: 'Birthday 2', count: 'Total Count', name: 'Other Name', isActive: 'Active'});

    this.observableValues = of(['A', 'B', 'C']).pipe(
      delay(2000)
    )
  }

  ngAfterViewInit() {
    this.querySearchComponent.load('name', ConditionOperator.EQUALS, 'paul');
  }
}
