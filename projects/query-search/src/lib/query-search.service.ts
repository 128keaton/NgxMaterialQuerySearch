import {EventEmitter, Inject} from '@angular/core';
import {Injectable} from '@angular/core';
import {QueryField} from "./models";
import {BehaviorSubject} from "rxjs";
import {QuerySearchConfig} from "./query-search.config";
import {ConditionOperator} from "./enums";
import {QueryRuleGroup} from "./models";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";
import {QUERY_SEARCH_CONFIG, querySearchDefaultConfig} from "./tokens";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  queryUpdated = new EventEmitter<QueryRuleGroup[]>();
  operators: string[] = [];
  fields: BehaviorSubject<QueryField[]> = new BehaviorSubject<QueryField[]>([]);


  private _fields: QueryField[] = [];
  private readonly _loggingCallback: (...args: any[]) => void = () => {
  };

  private readonly _debug: boolean = false;
  private readonly _generateButtonText: string = 'Generate';
  private readonly _appearance: MatFormFieldAppearance = 'outline';
  private readonly _transform:  (rules: QueryRuleGroup[]) => any;

  constructor(@Inject(QUERY_SEARCH_CONFIG) configuration: QuerySearchConfig) {
    this.operators = Object.keys(ConditionOperator).filter(k => !k.includes('LOW'));

    const config: QuerySearchConfig = {...querySearchDefaultConfig, ...configuration};

    if (!!config) {
      if (!!config.loggingCallback) {
        this._loggingCallback = config.loggingCallback;
      }

      if (config.hasOwnProperty('debug')) {
        this._debug = config.debug;
      }

      if (!!config.generateButtonText) {
        this._generateButtonText = config.generateButtonText;
      }

      if (!!config.appearance) {
        this._appearance = config.appearance;
      }

      if (!!config.transform) {
        this._transform = config.transform;
      }
    }
  }

  addFields(fields: QueryField[]) {
    this._fields.push(...fields);
    this.fields.next(this._fields);
  }

  log(...args: any[]) {
    if (!this._debug) {
      return;
    }

    this._loggingCallback(...args);
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
