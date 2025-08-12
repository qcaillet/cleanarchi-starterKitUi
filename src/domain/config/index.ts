export * from './general';
export * from './modules';
export * from './domain';
export * from './deployment';

import type { GeneralConfig } from './general';
import type { ModulesConfig } from './modules';
import type { DomainConfig } from './domain';
import type { DockerConfig } from './deployment';

export interface StartkitConfig extends GeneralConfig {
  modules: ModulesConfig;
  domain: DomainConfig;
  docker: DockerConfig;
}