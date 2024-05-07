import {
  defineModuleConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

export interface ServerStartupConfigurations {
  /**
   * Whether the server is hosted on a ssl enabled domain
   */
  https: boolean;
  /**
   * where the server get deployed.
   *
   * @default 'localhost'
   * @env AFFINE_SERVER_HOST
   */
  host: string;
  /**
   * which port the server will listen on
   *
   * @default 3010
   * @env AFFINE_SERVER_PORT
   */
  port: number;
  /**
   * subpath where the server get deployed if there is.
   *
   * @default '' // empty string
   * @env AFFINE_SERVER_SUB_PATH
   */
  path: string;
}

declare module '../../fundamentals/config-new' {
  interface AppConfig {
    server: ModuleConfig<ServerStartupConfigurations>;
  }
}

defineModuleConfig('server', {
  startup: {
    https: false,
    host: 'localhost',
    port: 3010,
    path: '',
  },
});
