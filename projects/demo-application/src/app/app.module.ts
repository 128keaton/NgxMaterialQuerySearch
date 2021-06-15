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

@NgModule({
  declarations: [
    AppComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    QuerySearchModule.forRoot({
      loggingCallback:  (...args) => {
        console.log(...args);
      },
      debug: true,
      generateButtonText: 'Query 2',
      appearance: 'outline',
      transform: rules => {
        console.log('Transform me', rules);
        return rules;
      }
    }),
    MatToolbarModule,
    MatCardModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
