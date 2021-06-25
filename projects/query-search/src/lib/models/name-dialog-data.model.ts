import {SavedFilter} from "./saved-filter.model";

export interface NameDialogData {
  action: 'EDIT' | 'CREATE';
  filter: SavedFilter;
}
