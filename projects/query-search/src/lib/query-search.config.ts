import {QueryRuleGroup} from "./models";

const querySearchDefaultConfig: QuerySearchConfig = {
  loggingCallback: () => {
  },
  debug: false,
  generateButtonText: 'Generate',
  appearance: 'outline',
  transform: (rules: QueryRuleGroup[]) => {
    return rules;
  }
};


export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  generateButtonText?: string;
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  transform?: (rules: QueryRuleGroup[]) => any;
}

export class QuerySearchConfiguration implements QuerySearchConfig {
  appearance: 'legacy' | 'standard' | 'fill' | 'outline';
  debug: boolean;
  generateButtonText: string;
  loggingCallback: () => void;
  transform: (rules: QueryRuleGroup[]) => any;

  constructor(config: QuerySearchConfig) {
    const correctedConfig = {...querySearchDefaultConfig, ...config};
    const defaultTransform =  (rules: QueryRuleGroup[]) => {
      return rules;
    };

    this.appearance = correctedConfig.appearance || 'outline';
    this.debug = correctedConfig.debug;
    this.generateButtonText = correctedConfig.generateButtonText || 'generate';
    this.loggingCallback = correctedConfig.loggingCallback;
    this.transform = correctedConfig.transform || defaultTransform;
  }
}


