import {AfterContentInit, Component, ContentChild} from '@angular/core';
import {QueryGroup, QueryRule, QueryRuleGroup} from "./models";
import {QueryFieldsDirective} from "./directives";
import {QuerySearchService} from "./query-search.service";
import {inOutAnimations} from "./animations";

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
   * Apply a prebuilt query to the component
   * @param rule - A single QueryRole
   */
  applyRule(rule: QueryRule) {
      this.groups.forEach(g => g.applyRule(rule));
  }

  get generateButtonText(): string {
    return this.querySearchService.generateButtonText;
  }

  get canAddGroup(): boolean {
    return this.groups.length === 0;
  }

  get canGenerate(): boolean {
    return this.groups.length > 0;
  }
}
