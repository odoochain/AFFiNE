import { defineModuleConfig, ModuleConfig } from '../config-new';

export type ThrottlerType = 'default' | 'strict';

type ThrottlerStartupConfigurations = {
  [key in ThrottlerType]: {
    ttl: number;
    limit: number;
  };
};

declare module '../config-new' {
  interface AppConfig {
    throttler: ModuleConfig<ThrottlerStartupConfigurations>;
  }
}

defineModuleConfig('throttler', {
  startup: {
    default: {
      ttl: 60,
      limit: 120,
    },
    strict: {
      ttl: 60,
      limit: 20,
    },
  },
});
