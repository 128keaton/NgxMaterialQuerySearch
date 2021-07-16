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
import {QueryGroup, SavedFilter} from './models';
import {QueryFieldsDirective} from './directives';
import {QuerySearchService} from './query-search.service';
import {inOutAnimations} from './animations';
import {ConditionOperator} from './enums';
import {VCRefInjector} from './helpers/parent.helper';
import {MatMenu} from '@angular/material/menu';
import {QuerySearchGroupComponent} from './components/query-search-group/query-search-group.component';
import {Observable} from 'rxjs';
import {ComponentCanDeactivate} from './guards/pending-changes.guard';

@Component({
  selector: 'ngx-query-search',
  templateUrl: 'query-search.component.html',
  styleUrls: ['query-search.component.scss'],
  animations: [
    ...inOutAnimations
  ]
})
export class QuerySearchComponent implements AfterContentInit, ComponentCanDeactivate {

  @Output() filterValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filterLoaded: EventEmitter<SavedFilter> = new EventEmitter<SavedFilter>();

  @Input() filterMenu?: MatMenu;

  @ViewChild('topGroup') topGroup: QuerySearchGroupComponent;

  @ContentChild(QueryFieldsDirective) queryFields: QueryFieldsDirective;

  groups: QueryGroup[] = [];
  filterLoading = false;

  private injectorRef: VCRefInjector;
  private currentFilter: SavedFilter;

  constructor(private querySearchService: QuerySearchService,
              private vcRef: ViewContainerRef) {
    this.injectorRef = new VCRefInjector(this.vcRef.injector);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = false;
    }
  }

  ngAfterContentInit() {
    this.querySearchService.addFields(this.queryFields.getFields());
    this.addGroup();
  }

  addGroup() {
    const newGroup = new QueryGroup('AND');
    this.groups.push(newGroup);
    this.filterValid.emit(this.canGenerateFilter);
  }

  remove(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
    this.filterValid.emit(this.canGenerateFilter);
  }

  generate() {
    this.querySearchService.log('Generating...', this.groups);
    this.querySearchService.emitQuery(this.groups.map(g => g.filterValue));
  }

  filterCleared() {
    this.filterLoaded.emit(undefined);
    this.filterValid.emit(this.canGenerateFilter);
  }

  filterLoadingChanged(loading: boolean) {
    this.filterLoading = loading;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!!this.topGroup.currentFilter) {
      return !this.topGroup.currentFilterChanged;
    }

    return true;
  }

  /**
   * Load a saved rule
   *
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
   *
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
   *
   * @param filter - SavedFilter to load
   */
  public loadSavedFilter(filter: SavedFilter) {
    this.filterLoading = true;
    this.currentFilter = filter;

    this.topGroup.clear();

    setTimeout(() => {
      this.topGroup.loadFilter(filter, () => {
        this.filterLoaded.emit(filter);
        this.filterChanged();
      });
    }, 100);
  }

  /**
   * Reload the current SavedFilter
   */
  public reload() {
    if (!!this.currentFilter) {
      this.loadSavedFilter(this.currentFilter);
    }
  }

  /**
   * Get the current filter as a SavedFilter
   *
   * @param name - Name of the SavedFilter
   */
  public generateSavedFilter(name: string | undefined = undefined): SavedFilter | null {
    const queryRuleGroup = this.topGroup.group.filterValue;

    if (Object.keys(queryRuleGroup).length === 0) {
      this.querySearchService.log('Refusing to make filter from empty QueryRuleGroup', queryRuleGroup);
      return null;
    }

    return {
      name,
      ruleGroup: queryRuleGroup
    };
  }

  get identity(): string {
    return `${this.injectorRef.parentIdentifier}-query-search`;
  }

  /**
   * Called when the filter has been changed
   */
  filterChanged() {
    this.filterValid.emit(this.canGenerateFilter);
  }

  /**
   * Returns true if we can generate a filter
   */
  private get canGenerateFilter(): boolean {
    if (!!this.topGroup && !!this.topGroup.group && !!this.topGroup.group.filterValue) {
      return Object.keys(this.topGroup.group.filterValue).length > 0;
    }

    return false;
  }
}
