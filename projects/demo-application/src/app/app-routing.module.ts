import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuerySearchComponent} from "./components/query-search/query-search.component";

const routes: Routes = [
  {
    path: '',
    component: QuerySearchComponent,
    canDeactivate: []
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
