import { merge } from 'lodash-es';

import pkg from '../../../package.json' assert { type: 'json' };
import {
  AFFINE_ENV,
  DeploymentType,
  NewAFFiNEConfig,
  NODE_ENV,
  PreDefinedAFFiNEConfig,
  ServerFlavor,
} from './def';
import { readEnv } from './env';
import { staticConfigsDefault } from './register';

function getPredefinedAFFiNEConfig(): PreDefinedAFFiNEConfig {
  const NODE_ENV = readEnv<NODE_ENV>('NODE_ENV', 'development', [
    'development',
    'test',
    'production',
  ]);
  const AFFINE_ENV = readEnv<AFFINE_ENV>('AFFINE_ENV', 'dev', [
    'dev',
    'beta',
    'production',
  ]);
  const flavor = readEnv<ServerFlavor>('SERVER_FLAVOR', 'allinone', [
    'allinone',
    'graphql',
    'sync',
  ]);
  const deploymentType = readEnv<DeploymentType>(
    'DEPLOYMENT_TYPE',
    NODE_ENV === 'development'
      ? DeploymentType.Affine
      : DeploymentType.Selfhosted,
    Object.values(DeploymentType)
  );
  const isSelfhosted = deploymentType === DeploymentType.Selfhosted;
  const affine = {
    canary: AFFINE_ENV === 'dev',
    beta: AFFINE_ENV === 'beta',
    stable: AFFINE_ENV === 'production',
  };
  const node = {
    prod: NODE_ENV === 'production',
    dev: NODE_ENV === 'development',
    test: NODE_ENV === 'test',
  };

  return {
    ENV_MAP: {},
    NODE_ENV,
    AFFINE_ENV,
    serverName: isSelfhosted ? 'Self-Host Cloud' : 'AFFiNE Cloud',
    version: pkg.version,
    get type() {
      return deploymentType;
    },
    get isSelfhosted() {
      return isSelfhosted;
    },
    get flavor() {
      return {
        type: flavor,
        graphql: flavor === 'graphql' || flavor === 'allinone',
        sync: flavor === 'sync' || flavor === 'allinone',
      };
    },
    get affine() {
      return affine;
    },
    get node() {
      return node;
    },
    get deploy() {
      return !node.dev && !node.test;
    },
  };
}

export function getAFFiNEConfigModifier(): NewAFFiNEConfig {
  const predefined = getPredefinedAFFiNEConfig() as NewAFFiNEConfig;

  // predefined.auth.dd = 1;
  return chainableProxy(predefined);
}

export function mergeConfigOverride(override: any) {
  return merge({}, getPredefinedAFFiNEConfig(), staticConfigsDefault, override);
}

function chainableProxy(obj: any) {
  const keys: string[] = Object.keys([]);
  return new Proxy(obj, {
    get(target, prop) {
      if (!(prop in target)) {
        target[prop] = chainableProxy({});
      }
      return target[prop];
    },
    set(target, prop, value) {
      if (
        typeof value === 'object' &&
        !(
          value instanceof Map ||
          value instanceof Set ||
          value instanceof Array
        )
      ) {
        target[prop] = chainableProxy(value);
        return true;
      }
      target[prop] = value;
      keys.push(prop as string);
      return true;
    },
    ownKeys() {
      return keys;
    },
  });
}
