import {AfterContentInit, Component, ContentChild} from '@angular/core';
import {QueryGroup} from "./models";
import {QueryFieldsDirective} from "./directives";
import {QuerySearchService} from "./query-search.service";
import {inOutAnimations} from "./animations";
import {ConditionOperator} from "./enums";

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss'],
  animations: [
    ...inOutAnimations
  ]
})
export class QuerySearchComponent implements AfterContentInit {

  @ContentChild(QueryFieldsDirective) queryFields: QueryFieldsDirective;

  groups: QueryGroup[] = [];

  constructor(private querySearchService: QuerySearchService) {
  }

  ngAfterContentInit() {
    this.querySearchService.addFields(this.queryFields.getFields());
    this.addGroup();
  }

  addGroup() {
    const newGroup = new QueryGroup('AND');
    this.groups.push(newGroup);
  }

  remove(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
  }

  generate() {
    this.querySearchService.log('Generating...', this.groups);
    this.querySearchService.emitQuery(this.groups.map(g => g.filterValue));
  }


  /**
   * Load a saved rule
   * @param fieldName - Field name
   * @param operator - ConditionOperator
   * @param value - Any sort of dumb value you want
   */
  load(fieldName: string, operator: ConditionOperator, value: any) {
      this.groups[0].loadItem(fieldName, operator, value);
  }
}
