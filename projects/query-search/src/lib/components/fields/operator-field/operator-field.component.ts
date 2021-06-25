import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {QuerySearchService} from "../../../query-search.service";
import {QueryItem} from "../../../models";
import {OperatorPipe} from "../../../pipes/operator.pipe";

@Component({
  selector: 'operator-field',
  templateUrl: './operator-field.component.html',
  styleUrls: ['./operator-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class OperatorFieldComponent {

  @Input()
  set item(newValue: QueryItem) {
    if (!!newValue) {
      this._item = newValue;
      if (!!this._item.condition) {
        this.fieldChanged(this._item.condition, false);
      }
    }
  }

  get item() {
    return this._item;
  }

  @Output()
  operatorSelected = new EventEmitter<string>(true);

  operatorFieldTrigger: string;
  operators: string[];
  filteredOperators: string[];
  operatorStyle = `
  position: absolute;
   right: 1em;
   color: gray
   `;

  private _item: QueryItem;

  constructor(private querySearchService: QuerySearchService,
              private operatorPipe: OperatorPipe) {
    this.operators = this.querySearchService.operators;
    this.filteredOperators = this.operators;
  }

  fieldChanged(event: string, emit = true) {
    if (emit) {
      this.operatorSelected.emit(event);
    }

    this.querySearchService.log('Operator Field Changed', event);

    const displayOperator = this.operatorPipe.transform(event);
    const displaySignOperator = this.operatorPipe.transform(event, true);

    if (this.querySearchService.showOperatorSuffix) {
      this.operatorFieldTrigger = `
        <span class="field-name">${displayOperator}</span>
        <span class="field-operator">${displaySignOperator || ''}</span>
    `;
    } else {
      this.operatorFieldTrigger = `
        <span class="field-name">${displayOperator}</span>
    `;
    }
  }

  searchValueChanged(searchValue: string) {
    if (!!searchValue && searchValue.trim().length > 0) {
      this.filteredOperators = this.operators.filter(operator => {
        return this.operatorPipe.transform(operator)?.toLowerCase().includes(searchValue)
      })
    } else {
      this.filteredOperators = this.operators;
    }
  }

  get padDividers(): boolean {
    return this.querySearchService.formFieldAppearance !== 'outline';
  }

  get formFieldAppearance() {
    return this.querySearchService.formFieldAppearance;
  }
}
