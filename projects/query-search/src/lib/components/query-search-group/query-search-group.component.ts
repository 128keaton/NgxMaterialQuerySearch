import {Component, EventEmitter, HostBinding, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {QueryGroup} from "../../models";
import {isEven} from "../../query-search.helpers";
import {QuerySearchService} from "../../query-search.service";
import {inOutAnimations} from "../../animations";
import {QuerySearchItemComponent} from "../query-search-item/query-search-item.component";

@Component({
  selector: 'query-search-group',
  templateUrl: './query-search-group.component.html',
  styleUrls: ['./query-search-group.component.scss'],
  animations: [
    ...inOutAnimations
  ]
})
export class QuerySearchGroupComponent implements OnInit {

  @Output()
  generateClicked = new EventEmitter<boolean>(true);

  @Input()
  set group(newValue: QueryGroup) {
    if (!!newValue) {
      this._group = newValue;
      this.class = `depth-${this._group.depth}`;
    }
  }


  @ViewChildren(QuerySearchItemComponent) items: QueryList<QuerySearchItemComponent>;
  @ViewChildren(QuerySearchGroupComponent) children: QueryList<QuerySearchGroupComponent>;

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

  constructor(private querySearchService: QuerySearchService) {
  }

  ngOnInit(): void {
    console.log(this.group);
  }


  addItem() {
   this.group.addItem();
   this.querySearchService.log('Adding item to', this);
  }

  addGroup() {
    this.group.addChild();
    this.querySearchService.log('Adding group to', this);
  }

  removeItem(id: string) {
    this.group.removeItem(id);
    this.querySearchService.log('Removed item with ID', id, 'from', this);
  }

  removeChild(id: string) {
    this.group.removeChild(id);
    this.querySearchService.log('Removed child with ID', id, 'from', this);
  }

  remove() {
    this.querySearchService.log('Removing group', this.group.id, this);
    this.children.forEach(child => child.remove());
    this.items.forEach(item => item.remove());
    this.removed.emit(this.group.id);
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

  get disableTypeButtons() {
    return this.group.children.length < 1 && this.group.items.length < 2;
  }

  get generateButtonText(): string {
    return this.querySearchService.generateButtonText;
  }

  get isTopLevel(): boolean {
    return this.group.depth === 0;
  }

}
