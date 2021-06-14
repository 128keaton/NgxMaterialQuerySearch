import {Component, Input, OnInit} from '@angular/core';
import {QueryRuleGroup} from "../../../../../query-search/src/lib/models";

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {

  @Input()
  queryObject: QueryRuleGroup[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}
