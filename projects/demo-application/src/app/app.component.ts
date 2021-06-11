import {Component} from '@angular/core';
import {QuerySearchService} from "ngx-mat-query-search";
import packageData from '../../../query-search/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-application';

  queryObject: any = {};
  queryString: string = '';
  version: string;
  githubRepo: string;

  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.queryUpdated.subscribe(newQueryObject => this.queryObject = newQueryObject);
    this.querySearchService.queryStringUpdated.subscribe(newQueryString => this.queryString = newQueryString);
    this.version = packageData.version;
    this.githubRepo = packageData.repository;
  }
}
