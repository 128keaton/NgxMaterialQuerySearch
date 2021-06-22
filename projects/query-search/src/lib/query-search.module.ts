import {ModuleWithProviders, NgModule} from '@angular/core';
import {QuerySearchComponent} from './query-search.component';
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
import {GroupTypeSelectorComponent} from './components/group-type-selector/group-type-selector.component';
import {QueryFieldDirective, QueryFieldsDirective} from "./directives/";
import {QUERY_SEARCH_CONFIG, QuerySearchConfig, QuerySearchConfiguration} from "./query-search.config";
import {OperatorPipe} from './pipes/operator.pipe';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDividerModule} from "@angular/material/divider";
import {QuerySearchService} from "./query-search.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {OperatorFieldComponent} from './components/fields/operator-field/operator-field.component';
import {NameFieldComponent} from './components/fields/name-field/name-field.component';
import {PlainValueFieldComponent} from './components/fields/plain-value-field/plain-value-field.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import { AutocompleteFieldComponent } from './components/fields/autocomplete-field/autocomplete-field.component';

@NgModule({
  declarations: [
    QuerySearchComponent,
    QuerySearchItemComponent,
    QuerySearchGroupComponent,
    GroupTypeSelectorComponent,
    QueryFieldDirective,
    QueryFieldsDirective,
    OperatorPipe,
    OperatorFieldComponent,
    NameFieldComponent,
    PlainValueFieldComponent,
    AutocompleteFieldComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    QuerySearchComponent,
    QueryFieldDirective,
    QueryFieldsDirective
  ],
})
export class QuerySearchModule {
  static forRoot(config?: QuerySearchConfig): ModuleWithProviders<QuerySearchModule> {
    const configuration = new QuerySearchConfiguration(config);

    return {
      ngModule: QuerySearchModule,
      providers: [
        {
          provide: QUERY_SEARCH_CONFIG, useValue: configuration
        },
        OperatorPipe,
        QuerySearchService
      ]
    };
  }
}
