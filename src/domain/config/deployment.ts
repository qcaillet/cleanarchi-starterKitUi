export interface DockerConfig {
  // Basique
  appPort: number;
  enableDebug: boolean;
  debugPort: number;
  imageName: string;
  jarPattern: string;
}