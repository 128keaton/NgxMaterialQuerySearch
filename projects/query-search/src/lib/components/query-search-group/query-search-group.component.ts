import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {QueryGroup, QueryItem, SavedFilter} from "../../models";
import {QuerySearchService} from "../../query-search.service";
import {inOutAnimations} from "../../animations";
import {QuerySearchItemComponent} from "../query-search-item/query-search-item.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {isEven} from "../../helpers/general.helpers";
import {MatMenu} from "@angular/material/menu";
import {tap} from "rxjs/operators";

@Component({
  selector: 'query-search-group',
  templateUrl: './query-search-group.component.html',
  styleUrls: ['./query-search-group.component.scss'],
  animations: [
    ...inOutAnimations
  ]
})
export class QuerySearchGroupComponent implements AfterViewInit {

  @Input() parent: QuerySearchGroupComponent;

  @Input() filterMenu?: MatMenu;

  @Output() generateClicked = new EventEmitter<boolean>(true);

  @Output() filterCleared = new EventEmitter();

  @Input()
  set group(newValue: QueryGroup) {
    if (!!newValue) {
      this._group = newValue;
      this.class = `depth-${this._group.depth}`;
    }
  }

  @ViewChildren(QuerySearchItemComponent) items: QueryList<QuerySearchItemComponent>;
  @ViewChildren(QuerySearchGroupComponent) children: QueryList<QuerySearchGroupComponent>;

  currentFilter?: SavedFilter;
  currentFilterChanged = false;
  loadingFilters = new EventEmitter<boolean>(true);

  get group() {
    return this._group;
  }

  set groupType(newValue: 'AND' | 'OR') {
    this._group.type = newValue;
    this.querySearchService.log('Updating group type to', newValue, 'with ID', this._group.id);
  }

  get groupType() {
    return this._group.type;
  }

  @Output()
  removed = new EventEmitter<string>();

  @HostBinding('class') class = 'depth-0';

  @Input()
  set showDivider(newValue: any) {
    this._showDivider = `${newValue}` === 'true';
  }

  _showDivider = false;
  private _group: QueryGroup;

  constructor(public querySearchService: QuerySearchService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.querySearchService.listIDs.push(this.dropListID);

    this.children.changes.pipe(
      tap(() => {
        setTimeout(() => {
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        }, 100)
      }),
    ).subscribe();
  }

  addItem() {
    this.group.addItem();
    this.querySearchService.log('Adding item to', this);
    this.currentFilterChanged = true;
  }

  addGroup() {
    this.group.addChild();
    this.querySearchService.log('Adding group to', this);
    this.currentFilterChanged = true;
  }

  removeItem(id: string) {
    this.group.removeItem(id);
    this.querySearchService.log('Removed item with ID', id, 'from', this);
    this.currentFilterChanged = true;
  }

  removeChild(id: string) {
    this.group.removeChild(id);
    this.querySearchService.log('Removed child with ID', id, 'from', this);
    this.currentFilterChanged = true;
  }

  remove(emit: boolean = true) {
    this.querySearchService.log('Removing group', this.group.id, this);
    this.children.forEach(child => child.remove(emit));
    this.items.forEach(item => item.remove(emit));
    if (emit) {
      this.removed.emit(this.group.id);
    }
  }

  clear() {
    this.querySearchService.log('Clearing group', this.group.id, this);
    this.children.forEach(child => child.remove());
    this.items.forEach(item => item.remove());
    this.group.addItem();
    this.currentFilter = undefined;
    this.currentFilterChanged = false;
    this.filterCleared.emit(undefined);
  }

  drop(event: CdkDragDrop<QueryItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.group.items, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    this.currentFilterChanged = true;
  }

  loadFilter(filter: SavedFilter | null) {
    this.loadingFilters.emit(true);
    this.currentFilterChanged = false;

    if (!!filter) {
      this.children.forEach(child => child.remove(false));
      this.items.forEach(item => item.remove(false));
      this.group.apply(filter.ruleGroup);
      this.currentFilter = filter;
    }

    this.loadingFilters.emit(false);
  }

  markChanged(item: QueryItem) {
    this.currentFilterChanged = true;
  }


  get toolbarColor() {
    if (!!this._group) {
      if (this._group.depth > 0 && isEven(this._group.depth)) {
        return 'warn';
      } else if (this._group.depth > 0) {
        return 'accent';
      }
    }

    return 'primary';
  }

  get groupColor() {
    if (!!this._group) {
      if (this._group.depth > 0 && isEven(this._group.depth)) {
        return 'primary';
      } else if (this._group.depth > 0) {
        return 'warn';
      }
    }

    return 'accent';
  }

  get disableTypeButtons() {
    return this.group.children.length < 1 && this.group.items.length < 2;
  }

  get generateButtonText(): string {
    return this.querySearchService.generateButtonText;
  }

  get isTopLevel(): boolean {
    return this.group.depth === 0;
  }

  get dropListID(): string {
    return `drop-list-${this.group.depth}`
  }

  get noItems(): boolean {
    return this.group.children.length === 0 && this.group.items.length === 0;
  }
}
