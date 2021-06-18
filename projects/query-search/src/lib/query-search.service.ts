import {EventEmitter, Inject, Optional} from '@angular/core';
import {Injectable} from '@angular/core';
import {QueryField, ValueNotification, QueryRuleGroup} from "./models";
import {BehaviorSubject} from "rxjs";
import {QUERY_SEARCH_CONFIG, QuerySearchConfiguration} from "./query-search.config";
import {ConditionOperator} from "./enums";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  queryUpdated = new EventEmitter<any>();
  operators: string[] = [];
  fields: BehaviorSubject<QueryField[]> = new BehaviorSubject<QueryField[]>([]);
  valueFieldDidChange: EventEmitter<ValueNotification> = new EventEmitter<ValueNotification>(true);
  searchValueFieldDidChange: EventEmitter<ValueNotification> = new EventEmitter<ValueNotification>(true);

  private _fields: QueryField[] = [];
  private readonly _loggingCallback: (...args: any[]) => void = () => {
  };

  private readonly _debug: boolean = false;
  private readonly _generateButtonText: string = 'Generate';
  private readonly _appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  private readonly _transform: (rules: QueryRuleGroup[]) => any;

  constructor(@Optional() @Inject(QUERY_SEARCH_CONFIG) configuration: QuerySearchConfiguration) {
    this.operators = Object.keys(ConditionOperator).filter(k => !k.includes('LOW'));
    this._loggingCallback = configuration.loggingCallback;
    this._debug = configuration.debug;
    this._generateButtonText = configuration.generateButtonText;
    this._appearance = configuration.appearance;
    this._transform = configuration.transform;

    this.valueFieldDidChange.subscribe(value => {
      this.log('Value field changed', value);
    })
  }

  addFields(fields: QueryField[]) {
    fields.forEach(field => {
      const existingField = this._fields.find(f => f.name === field.name && f.label === field.label);
      if (!existingField) {
        this._fields.push(field);
      }
    })

    this.fields.next(this._fields);
  }

  log(...args: any[]) {
    if (!this._debug) {
      return;
    }

    this._loggingCallback(...args);
  }

  valueFieldChanged(field: QueryField, partialValue: string) {
    this.valueFieldDidChange.emit({field, partialValue: partialValue.toLowerCase()});
  }

  searchValueFieldChanged(field: QueryField, partialValue: string) {
    this.searchValueFieldDidChange.emit({field, partialValue: partialValue.toLowerCase()});
  }

  emitQuery(rules: QueryRuleGroup[]) {
    this.log('Emitting rules', rules);

    if (!!this._transform) {
      this.queryUpdated.emit(this._transform(rules));
    } else {
      this.queryUpdated.emit(rules);
    }
  }

  /**
   * Consume a Class/Model statically which provides fields and their information to the component
   * @param instance - Class
   * @param labels - Labels in a key/value object
   */
  consumeModel<T>(instance: any, labels: {} = {}) {
    const toConsume: T = new instance();

    return this.consumeObject(toConsume, labels);
  }

  /**
   * Consume an object which provides fields and their information to the component
   * @param instance - Class
   * @param labels - Labels in a key/value object
   */
  consumeObject<T>(instance: any, labels: {} = {}) {
    const fields = Object.getOwnPropertyNames(instance).map((propName: string) => {
      let fieldType: any = typeof (instance as any)[propName];
      let label = undefined;

      if (fieldType === 'object') {
        if (Object.prototype.toString.call((instance as any)[propName]) === '[object Date]') {
          fieldType = 'date';
        }
      }


      if (!!labels && labels.hasOwnProperty(propName)) {
        label = (labels as any)[propName] as string;
      }

      return {
        name: propName,
        type: fieldType as 'boolean' | 'date' | 'number' | 'string' | 'array',
        values: [],
        label
      }
    });

    this.addFields(fields);
  }

  get generateButtonText(): string {
    return this._generateButtonText;
  }

  get formFieldAppearance() {
    return this._appearance;
  }
}
