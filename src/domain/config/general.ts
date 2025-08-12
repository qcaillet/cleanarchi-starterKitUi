export interface GeneralConfig {
  microserviceName: string;
  groupId: string;
  version: string;
  artifactId: string;
  javaVersion: number;
  diFramework: string;
  springProfiles: string[];
  serverPort: number;
  description: string;
}

export type JavaVersion = 17 | 21;