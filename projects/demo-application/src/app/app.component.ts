import { Component } from '@angular/core';
import {QuerySearchService} from "ngx-mat-query-search";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-application';

  queryObject: any = {};


  constructor(private querySearchService: QuerySearchService) {
    this.querySearchService.fieldNames = [
      'name',
      'active',
      'createdAt'
    ];
  }
}
