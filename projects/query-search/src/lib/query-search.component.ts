import {AfterContentInit, Component, ContentChild, ViewContainerRef} from '@angular/core';
import {QueryGroup} from "./models";
import {QueryFieldsDirective} from "./directives";
import {QuerySearchService} from "./query-search.service";
import {inOutAnimations} from "./animations";
import {ConditionOperator} from "./enums";
import {VCRefInjector} from "./helpers/parent.helper";

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

  private injectorRef: VCRefInjector;

  constructor(private querySearchService: QuerySearchService,
              private vcRef: ViewContainerRef) {
    this.injectorRef = new VCRefInjector(this.vcRef.injector);
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
    this.querySearchService.log('Loading pre-selected filter', {fieldName, operator, value});
    this.groups[0].loadItem(fieldName, operator, value);
  }

  get identity(): string {
    return `${this.injectorRef.parentIdentifier}-query-search`;
  }
}
