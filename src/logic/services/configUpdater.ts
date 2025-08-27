import type { StartkitConfig } from '@/domain/config';

export class ConfigUpdater {
  static updateConfig(config: StartkitConfig, path: string, value: unknown): StartkitConfig {
    const newConfig = structuredClone(config);
    const keys = path.split('.');
    let current: Record<string, unknown> = newConfig as unknown as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    
    return newConfig;
  }
}