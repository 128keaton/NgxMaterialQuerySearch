import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {QuerySearchModule} from "ngx-mat-query-search";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OutputComponent} from './components/output/output.component';
import {MatCardModule} from "@angular/material/card";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import { QuerySearchComponent } from './components/query-search/query-search.component';
import {MatIconModule} from "@angular/material/icon";
import { InputRawFilterComponent } from './components/input-raw-filter/input-raw-filter.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    OutputComponent,
    QuerySearchComponent,
    InputRawFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    QuerySearchModule.forRoot({
      loggingCallback: (...args) => {
        console.log(...args);
      },
      debug: true,
      appearance: 'outline',
      limitResults: 20,
      transform: rules => {
        console.log('Transform me', rules);
        return rules;
      }
    }),
    MatToolbarModule,
    MatCardModule,
    MatNativeDateModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
