import {QueryRuleGroup} from "./models";
import {InjectionToken} from "@angular/core";

export const QUERY_SEARCH_CONFIG = new InjectionToken<QuerySearchConfiguration>('QUERY_SEARCH_CONFIG');

const querySearchDefaultConfig: QuerySearchConfig = {
  loggingCallback: () => {
  },
  debug: false,
  generateButtonText: 'Generate',
  appearance: 'outline',
  sortFields: true,
  transform: (rules: QueryRuleGroup[]) => {
    return rules;
  }
};


export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  generateButtonText?: string;
  sortFields?: boolean;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  transform?: (rules: QueryRuleGroup[]) => any;
}

export class QuerySearchConfiguration implements QuerySearchConfig {
  appearance: 'legacy' | 'standard' | 'fill' | 'outline';
  debug: boolean;
  sortFields: boolean;
  generateButtonText: string;
  loggingCallback: () => void;
  transform: (rules: QueryRuleGroup[]) => any;

  constructor(config?: QuerySearchConfig) {
    const correctedConfig = {...querySearchDefaultConfig, ...config};
    const defaultTransform =  (rules: QueryRuleGroup[]) => {
      return rules;
    };

    this.appearance = correctedConfig.appearance || 'outline';
    this.debug = correctedConfig.debug;
    this.generateButtonText = correctedConfig.generateButtonText || 'generate';
    this.loggingCallback = correctedConfig.loggingCallback;
    this.transform = correctedConfig.transform || defaultTransform;

    if (correctedConfig.sortFields !== undefined) {
      this.sortFields = correctedConfig.sortFields;
    } else {
      this.sortFields = true;
    }
  }
}


