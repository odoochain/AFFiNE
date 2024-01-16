import {
  defineModuleConfig,
  ModuleConfig,
} from '../../fundamentals/config-new';

interface DocStartupConfigurations {
  manager: {
    /**
     * Whether auto merge updates into doc snapshot.
     */
    enableUpdateAutoMerging: boolean;

    /**
     * How often the [DocManager] will start a new turn of merging pending updates into doc snapshot.
     *
     * This is not the latency a new joint client will take to see the latest doc,
     * but the buffer time we introduced to reduce the load of our service.
     *
     * in {ms}
     */
    updatePollInterval: number;

    /**
     * The maximum number of updates that will be pulled from the server at once.
     * Existing for avoiding the server to be overloaded when there are too many updates for one doc.
     */
    maxUpdatesPullCount: number;
  };
  history: {
    /**
     * How long the buffer time of creating a new history snapshot when doc get updated.
     *
     * in {ms}
     */
    interval: number;
  };
}

interface DocRuntimeConfigurations {
  /**
   * Use `y-octo` to merge updates at the same time when merging using Yjs.
   *
   * This is an experimental feature, and aimed to check the correctness of JwstCodec.
   */
  experimentalMergeWithYOcto: boolean;
}

declare module '../../fundamentals/config-new' {
  interface AppConfig {
    doc: ModuleConfig<DocStartupConfigurations, DocRuntimeConfigurations>;
  }
}

defineModuleConfig('doc', {
  startup: {
    manager: {
      enableUpdateAutoMerging: true,
      updatePollInterval: 1000,
      maxUpdatesPullCount: 100,
    },
    history: {
      interval: 1000,
    },
  },
  runtime: {
    experimentalMergeWithYOcto: {
      desc: 'Use `y-octo` to merge updates at the same time when merging using Yjs.',
      default: false,
    },
  },
});
