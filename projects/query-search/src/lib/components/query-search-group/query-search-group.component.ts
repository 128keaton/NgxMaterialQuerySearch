import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {QueryGroup} from "../../models";
import {isEven} from "../../query-search.helpers";
import {QuerySearchService} from "../../query-search.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'query-search-group',
  templateUrl: './query-search-group.component.html',
  styleUrls: ['./query-search-group.component.scss'],
  animations: [
    trigger('inOut', [
      state('in', style({ height: 'auto' })),
      transition('void => *', [
        style({ height: 0 }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ height: 0 }))
      ])
    ]),
  ]
})
export class QuerySearchGroupComponent implements OnInit {

  @HostBinding('class.collapsed') collapsed: boolean = false;

  @Input()
  set group(newValue: QueryGroup) {
    if (!!newValue) {
      this._group = newValue;
      this.class = `depth-${this._group.depth}`;
    }
  }

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


  private _group: QueryGroup;

  constructor(private querySearchService: QuerySearchService) {
  }

  ngOnInit(): void {
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
    this.collapsed = true;
    this.querySearchService.log('Removing group', this.group.id, this);
    setTimeout(() => this.removed.emit(this.group.id), 50);
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
}
