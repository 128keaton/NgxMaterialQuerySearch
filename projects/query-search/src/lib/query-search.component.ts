import {AfterContentInit, Component, ContentChild} from '@angular/core';
import {QueryGroup} from "./models";
import {QueryFieldsDirective} from "./directives";
import {QuerySearchService} from "./query-search.service";
import {RequestQueryBuilder} from "@nestjsx/crud-request";

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss']
})
export class QuerySearchComponent implements AfterContentInit {

  @ContentChild(QueryFieldsDirective) queryFields: QueryFieldsDirective;

  groups: QueryGroup[] = [];

  constructor(private querySearchService: QuerySearchService) {
  }

  ngAfterContentInit() {
    this.querySearchService.addFields(this.queryFields.getFields());
  }

  addGroup() {
    const newGroup = new QueryGroup('AND');
    this.groups.push(newGroup);
  }

  remove(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
  }

  generate() {
    const andFilters: any[]  = [];
    const orFilters: any[] = [];

    this.groups.map(g => g.filterValue).forEach((filterValue: {$and: any, $or: any}) => {
      if (filterValue.hasOwnProperty('$and')) {
        andFilters.push(...filterValue.$and);
      } else if (filterValue.hasOwnProperty('$or')) {
        orFilters.push(...filterValue.$or)
      }
    });

    this.querySearchService.log('andFilters', andFilters);
    this.querySearchService.log('orFilters', orFilters);

    const queryBuilder = RequestQueryBuilder.create();

    if (orFilters.length > 0) {
      queryBuilder.search({
        $or: orFilters,
      });
    } else if (andFilters.length > 0) {
      queryBuilder.search({
        $and: andFilters
      });
    }

    this.querySearchService.emitQuery(queryBuilder);
  }


}
