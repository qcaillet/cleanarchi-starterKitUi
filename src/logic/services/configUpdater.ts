import type { StartkitConfig } from '@/domain/config';

export class ConfigUpdater {
  static updateConfig(config: StartkitConfig, path: string, value: unknown): StartkitConfig {
    const newConfig = structuredClone(config);
    const keys = path.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    return newConfig;
  }
}