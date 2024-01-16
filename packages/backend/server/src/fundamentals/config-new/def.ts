import type { LeafPaths } from '../utils/types';
import { AppStartupConfig } from './register';

export type EnvConfigType = 'string' | 'int' | 'float' | 'boolean';
export type ServerFlavor = 'allinone' | 'graphql' | 'sync';
export type AFFINE_ENV = 'dev' | 'beta' | 'production';
export type NODE_ENV = 'development' | 'test' | 'production';

export enum DeploymentType {
  Affine = 'affine',
  Selfhosted = 'selfhosted',
}

export type ConfigPaths = LeafPaths<AppStartupConfig, '', '.....'>;

export interface PreDefinedAFFiNEConfig {
  ENV_MAP: Record<string, ConfigPaths | [ConfigPaths, EnvConfigType?]>;
  readonly AFFINE_ENV: AFFINE_ENV;
  readonly NODE_ENV: NODE_ENV;
  readonly serverName: string;
  readonly version: string;
  get type(): DeploymentType;
  get isSelfhosted(): boolean;
  get flavor(): { type: string; graphql: boolean; sync: boolean };
  get affine(): { canary: boolean; beta: boolean; stable: boolean };
  get node(): { prod: boolean; dev: boolean; test: boolean };
  get deploy(): boolean;
}

export type NewAFFiNEConfig = PreDefinedAFFiNEConfig & AppStartupConfig;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace globalThis {
    // eslint-disable-next-line no-var
    var NEW_AFFiNE: NewAFFiNEConfig;
  }
}
