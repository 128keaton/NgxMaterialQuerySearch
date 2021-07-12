import {EventEmitter, Inject, Optional} from '@angular/core';
import {Injectable} from '@angular/core';
import {QueryField, QueryRuleGroup, QueryRule} from "./models";
import {BehaviorSubject} from "rxjs";
import {QUERY_SEARCH_CONFIG, QuerySearchConfiguration} from "./query-search.config";
import {ConditionOperator} from "./enums";
import {isArray} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class QuerySearchService {

  queryUpdated = new EventEmitter<any>();
  operators: string[] = [];
  fields: BehaviorSubject<QueryField[]> = new BehaviorSubject<QueryField[]>([]);

  private _fields: QueryField[] = [];
  private readonly _loggingCallback: (...args: any[]) => void = () => {
  };

  private readonly _debug: boolean = false;
  private readonly _sortFields: boolean = true;
  private readonly _generateButtonText: string = 'Generate';
  private readonly _appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  private readonly _transform: (rules: QueryRuleGroup[]) => any;
  private readonly _limitResults: number = 50;
  private readonly _showFieldNameSuffix: boolean = true;
  private readonly _showOperatorSuffix: boolean = true;

  constructor(@Optional() @Inject(QUERY_SEARCH_CONFIG) configuration: QuerySearchConfiguration) {
    this.operators = Object.keys(ConditionOperator).filter(k => !k.includes('LOW'));
    this._loggingCallback = configuration.loggingCallback;
    this._debug = configuration.debug;
    this._sortFields = configuration.sortFields;
    this._generateButtonText = configuration.generateButtonText;
    this._appearance = configuration.appearance;
    this._transform = configuration.transform;
    this._limitResults = configuration.limitResults;
    this._showFieldNameSuffix = configuration.showFieldNameSuffix;
    this._showOperatorSuffix = configuration.showOperatorSuffix;
  }

  addFields(fields: QueryField[]) {
    const sortedFields = (this._sortFields ? fields.sort((a, b) => a.name.localeCompare(b.name)) : fields);
    sortedFields.forEach(field => {
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

  emitQuery(rules: QueryRuleGroup[]) {
    const filteredRules = rules.filter(ruleGroup => !!ruleGroup && !!ruleGroup.rules).map(ruleGroup => {
      ruleGroup.rules = ruleGroup.rules.filter(rule => {
        if (rule instanceof QueryRule || rule.hasOwnProperty('active')) {
          return (rule as QueryRule).active;
        }

        return true;
      });
      return ruleGroup;
    });

    this.log('Emitting rules', filteredRules);

    if (!!this._transform) {
      this.queryUpdated.emit(this._transform(filteredRules));
    } else {
      this.queryUpdated.emit(filteredRules);
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

  /**
   * Check if a field has provided values
   * @param fieldName - Name of the field
   */
  checkForValues(fieldName: string): boolean {
    if (!!fieldName) {
      const field = this._fields.find(field => field.name === fieldName);

      if (!!field && !!field.values) {
        if (isArray(field.values)) {
          return field.values.length > 0;
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the max length for a field
   * @param fieldName
   */
  getFieldMaxLength(fieldName: string): number | undefined {
    const field = this.getField(fieldName);

    if (!!field) {
      return field.maxLength;
    }

    return;
  }


  /**
   * Check if a field has provided values
   * @param fieldName - Name of the field
   */
  getField(fieldName: string): QueryField | null {
    if (!!fieldName) {
      return this._fields.find(field => field.name === fieldName) || null;
    }

    return null;
  }

  get generateButtonText(): string {
    return this._generateButtonText;
  }

  get formFieldAppearance() {
    return this._appearance;
  }

  get resultsLimit(): number | undefined {
    if (!!this._limitResults) {
      return this._limitResults === 0 ? undefined : this._limitResults;
    }

    return undefined;
  }

  get showFieldNameSuffix() {
    return this._showFieldNameSuffix;
  }

  get showOperatorSuffix() {
    return this._showOperatorSuffix;
  }
}
