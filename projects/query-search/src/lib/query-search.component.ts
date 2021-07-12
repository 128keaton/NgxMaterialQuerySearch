import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter, HostListener,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {QueryGroup, SavedFilter} from "./models";
import {QueryFieldsDirective} from "./directives";
import {QuerySearchService} from "./query-search.service";
import {inOutAnimations} from "./animations";
import {ConditionOperator} from "./enums";
import {VCRefInjector} from "./helpers/parent.helper";
import {MatMenu} from "@angular/material/menu";
import {QuerySearchGroupComponent} from "./components/query-search-group/query-search-group.component";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "./guards/pending-changes.guard";

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss'],
  animations: [
    ...inOutAnimations
  ]
})
export class QuerySearchComponent implements AfterContentInit, ComponentCanDeactivate {

  @Output() filterLoaded: EventEmitter<SavedFilter> = new EventEmitter<SavedFilter>();

  @Input() filterMenu?: MatMenu;

  @ViewChild('topGroup') topGroup: QuerySearchGroupComponent;

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

  filterCleared() {
    this.filterLoaded.emit(undefined);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!!this.topGroup.currentFilter) {
      return !this.topGroup.currentFilterChanged;
    }

    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = false;
    }
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

  /**
   * Notify the component that the current SavedFilter has been saved in some way
   * @param filter - The new SavedFilter or null if the filter is pre-existing
   */
  public filterSaved(filter: SavedFilter | null = null) {
    if (!!filter) {
      this.topGroup.currentFilter = filter;
    }

    this.topGroup.currentFilterChanged = false;
  }

  /**
   * Clear the current SavedFilter
   */
  public clearSavedFilter() {
    this.topGroup.clear();
  }

  /**
   * Load a SavedFilter
   * @param filter - SavedFilter to load
   */
  public loadSavedFilter(filter: SavedFilter) {
    this.topGroup.loadFilter(filter);

    setTimeout(() => {
      this.filterLoaded.emit(filter)
    }, 150);
  }

  /**
   * Get the current filter as a SavedFilter
   * @param name - Name of the SavedFilter
   */
  public generateSavedFilter(name: string): SavedFilter | null {
    const queryRuleGroup = this.topGroup.group.filterValue;

    if (Object.keys(queryRuleGroup).length === 0) {
      this.querySearchService.log('Refusing to make filter from empty QueryRuleGroup', queryRuleGroup);
      return null;
    }

    return {
      name,
      ruleGroup: queryRuleGroup
    }
  }

  get identity(): string {
    return `${this.injectorRef.parentIdentifier}-query-search`;
  }
}
