export interface DockerConfig {
  appPort: number;
  enableDebug: boolean;
  debugPort: number;
  imageName: string;
  jarPattern: string;
}