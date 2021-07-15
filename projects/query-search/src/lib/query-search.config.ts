import {QueryRuleGroup} from './models';
import {InjectionToken} from '@angular/core';

export const QUERY_SEARCH_CONFIG = new InjectionToken<QuerySearchConfiguration>('QUERY_SEARCH_CONFIG');

const querySearchDefaultConfig: QuerySearchConfig = {
  loggingCallback: () => {
  },
  debug: false,
  generateButtonText: 'Generate',
  appearance: 'outline',
  sortFields: true,
  limitResults: 50,
  showFieldNameSuffix: true,
  showOperatorSuffix: true,
  transform: (rules: QueryRuleGroup[]) => rules
};


export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  generateButtonText?: string;
  sortFields?: boolean;
  limitResults?: number;
  showFieldNameSuffix?: boolean;
  showOperatorSuffix?: boolean;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  transform?: (rules: QueryRuleGroup[]) => any;
}

export class QuerySearchConfiguration implements QuerySearchConfig {
  appearance: 'legacy' | 'standard' | 'fill' | 'outline';
  debug: boolean;
  sortFields: boolean;
  generateButtonText: string;
  limitResults: number;
  showFieldNameSuffix: boolean;
  showOperatorSuffix: boolean;
  loggingCallback: () => void;
  transform: (rules: QueryRuleGroup[]) => any;

  constructor(config?: QuerySearchConfig) {
    const correctedConfig = {...querySearchDefaultConfig, ...config};
    const defaultTransform =  (rules: QueryRuleGroup[]) => rules;

    this.appearance = correctedConfig.appearance || 'outline';
    this.debug = correctedConfig.debug;
    this.generateButtonText = correctedConfig.generateButtonText || 'generate';
    this.loggingCallback = correctedConfig.loggingCallback;
    this.transform = correctedConfig.transform || defaultTransform;
    this.limitResults = correctedConfig.limitResults || 50;

    if (correctedConfig.sortFields !== undefined) {
      this.sortFields = correctedConfig.sortFields;
    } else {
      this.sortFields = true;
    }

    if (correctedConfig.showFieldNameSuffix !== undefined) {
      this.showFieldNameSuffix = correctedConfig.showFieldNameSuffix;
    } else {
      this.showFieldNameSuffix = true;
    }

    if (correctedConfig.showOperatorSuffix !== undefined) {
      this.showOperatorSuffix = correctedConfig.showOperatorSuffix;
    } else {
      this.showOperatorSuffix = true;
    }
  }
}


