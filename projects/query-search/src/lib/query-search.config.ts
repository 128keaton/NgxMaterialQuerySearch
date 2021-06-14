import {InjectionToken} from "@angular/core";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";

export interface QuerySearchConfig {
  loggingCallback: () => void;
  debug: boolean;
  generateButtonText?: string;
  appearance?: MatFormFieldAppearance
}

export const QUERY_SEARCH_CONFIG = new InjectionToken<QuerySearchConfig>('Query Search Configuration', {
  providedIn: 'any',
  factory: () => {
    return {
      loggingCallback: () => {
      },
      debug: false,
      generateButtonText: 'Generate',
      appearance: 'outline'
    }
  }
});
