import {Component, Inject} from '@angular/core';
import {SavedFilter} from "../../../models";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {QuerySearchService} from "../../../query-search.service";
import {NameDialogData} from "../../../models/name-dialog-data.model";

@Component({
  selector: 'name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss']
})
export class NameDialogComponent {

  filter: SavedFilter;
  action: 'EDIT' | 'CREATE';
  actionDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: NameDialogData,
              public querySearchService: QuerySearchService) {
    this.filter = data.filter;
    this.action = data.action;
    this.nameValueUpdated();
  }

  nameValueUpdated() {
    this.actionDisabled = this.data.filter.name.length === 0;
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }

  get dialogTitle(): string {
    return this.action === 'EDIT' ? `Editing ${(this.filter.name.length ? this.filter.name : 'a filter')}` : 'New Filter'
  }

  get actionButtonTitle(): string {
    return this.action === 'EDIT' ? 'Save' : 'Create'
  }
}
