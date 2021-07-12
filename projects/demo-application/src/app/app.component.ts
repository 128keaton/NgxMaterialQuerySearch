import {Component} from '@angular/core';
import packageData from '../../../query-search/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version: string;
  githubRepo: string;

  constructor() {
    this.version = packageData.version;
    this.githubRepo = packageData.repository;
  }
}
