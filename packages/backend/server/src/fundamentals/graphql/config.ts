import { ApolloDriverConfig } from '@nestjs/apollo';

import {
  defineModuleConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

declare module '../../fundamentals/config-new' {
  interface AppConfig {
    graphql: ModuleConfig<ApolloDriverConfig>;
  }
}

defineModuleConfig('graphql', {
  startup: {
    buildSchemaOptions: {
      numberScalarMode: 'integer',
    },
    introspection: true,
    playground: true,
  },
});
