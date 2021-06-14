import {Component} from '@angular/core';
import {QuerySearchService} from "ngx-mat-query-search";
import packageData from '../../../query-search/package.json';
import {Demo} from "./demo.model";
import {QueryRuleGroup} from "../../../query-search/src/lib/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-application';

  queryObject: QueryRuleGroup[] = [];
  version: string;
  githubRepo: string;

  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.version = packageData.version;
    this.githubRepo = packageData.repository;

    this.querySearchService.consumeModel(Demo, {birthday: 'Birthday 2', count: 'Total Count', name: 'Other Name', isActive: 'Active'});
  }
}
