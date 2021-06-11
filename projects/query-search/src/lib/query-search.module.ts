import {NgModule} from '@angular/core';
import {QuerySearchComponent} from './query-search.component';
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {QuerySearchItemComponent} from './components/query-search-item/query-search-item.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {QuerySearchGroupComponent} from './components/query-search-group/query-search-group.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";


@NgModule({
  declarations: [
    QuerySearchComponent,
    QuerySearchItemComponent,
    QuerySearchGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonToggleModule
  ],
  exports: [
    QuerySearchComponent
  ]
})
export class QuerySearchModule {
}
