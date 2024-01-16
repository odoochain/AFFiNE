import { defineModuleConfig, ModuleConfig } from '../config-new';

declare module '../config-new' {
  interface AppConfig {
    metrics: ModuleConfig<{
      /**
       * Enable metric and tracing collection
       */
      enabled: boolean;
    }>;
  }
}

defineModuleConfig('metrics', {
  startup: {
    enabled: false,
  },
});
