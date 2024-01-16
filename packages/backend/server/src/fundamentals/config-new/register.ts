import { merge } from 'lodash-es';

import {
  AppConfig,
  ConfigDescriptions,
  RuntimeConfigDescription,
} from './types';

export type AppStartupConfig = {
  [Module in keyof AppConfig as AppConfig[Module]['startup'] extends never
    ? never
    : Module]: AppConfig[Module]['startup'];
};

export const staticConfigsDefault: AppStartupConfig = {} as any;
export const runtimeConfigsDefault: Array<{
  module: string;
  name: string;
  value: any;
}> = [];

function registerRuntimeConfig(
  module: string,
  configs: Record<string, any>,
  parent = ''
) {
  Object.entries(configs).forEach(([key, value]) => {
    if (parent) {
      key = `${parent}.${key}`;
    }

    // config item
    if ('desc' in value && typeof value.desc === 'string') {
      const item = value as RuntimeConfigDescription<any>;

      runtimeConfigsDefault.push({
        module,
        name: 'key',
        value: item.default,
      });
    } else {
      parent = key;
      registerRuntimeConfig(module, value, parent);
    }
  });
}

export function defineModuleConfig<T extends keyof AppConfig>(
  module: T,
  configs: ConfigDescriptions<AppConfig[T]>
) {
  if ('startup' in configs) {
    // @ts-expect-error allow
    staticConfigsDefault[module] = merge(
      // @ts-expect-error allow
      staticConfigsDefault[module] ?? {},
      configs.startup
    );
  }

  if ('runtime' in configs) {
    registerRuntimeConfig(module, configs.runtime);
  }
}
