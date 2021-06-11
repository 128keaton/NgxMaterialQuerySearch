import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {

  @Input()
  queryObject: any = {};

  @Input()
  queryString: string = '';

  constructor() { }

  ngOnInit(): void {
  }
}
