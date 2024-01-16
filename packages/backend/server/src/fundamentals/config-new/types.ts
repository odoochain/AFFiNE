export type ConfigItem<T> = T & { __type: 'ConfigItem' };

type ConfigDef = Record<string, any> | never;

export interface ModuleConfig<
  Startup extends ConfigDef = never,
  Runtime extends ConfigDef = never,
> {
  startup: Startup;
  runtime: Runtime;
}

export type RuntimeConfigDescription<T> = {
  desc: string;
  default: T;
};

type RuntimeConfigDescriptions<T extends ConfigDef> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends ConfigItem<infer V>
      ? RuntimeConfigDescription<V>
      : RuntimeConfigDescriptions<T[K]>
    : RuntimeConfigDescription<T[K]>;
};

type StaticConfigDescriptions<T extends ConfigDef> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends ConfigItem<infer V>
      ? V
      : T[K]
    : T[K];
};

export type ConfigDescriptions<T extends ModuleConfig<any, any>> =
  T extends ModuleConfig<infer S, infer R>
    ?
        | (S extends never
            ? { startup?: never }
            : { startup: StaticConfigDescriptions<S> })
        | (R extends never
            ? { runtime?: never }
            : { runtime: RuntimeConfigDescriptions<R> })
    : never;

export interface AppConfig {}
