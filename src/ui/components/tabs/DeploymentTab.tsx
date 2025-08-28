import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { StartkitConfig } from '@/domain/types';

interface DeploymentTabProps {
  config: StartkitConfig;
  onUpdateConfig: (path: string, value: unknown) => void;
}

export const DeploymentTab: React.FC<DeploymentTabProps> = ({
  config,
  onUpdateConfig
}) => {
  const dockerConfig = {
    ...config.docker,
    appPort: config.docker?.appPort || 8080,
    enableDebug: config.docker?.enableDebug || false,
    debugPort: config.docker?.debugPort || 5005,
    imageName: config.docker?.imageName || `mon-app:java${config.javaVersion}`,
    jarPattern: config.docker?.jarPattern || 'target/*.jar'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de déploiement</CardTitle>
        <CardDescription>Paramètres Docker et de runtime pour votre application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Java Version */}
          <div className="space-y-2">
            <Label htmlFor="docker-javaVersion">Version Java</Label>
            <Input
              id="docker-javaVersion"
              value={`Java ${config.javaVersion}`}
              readOnly
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">Utilise la version Java de l'onglet général - Remplit java.version dans Dockerfile.tpl</p>
          </div>

          {/* App Port */}
          <div className="space-y-2">
            <Label htmlFor="docker-appPort">Port de l'application</Label>
            <Input
              id="docker-appPort"
              type="number"
              value={dockerConfig.appPort}
              onChange={(e) => onUpdateConfig('docker.appPort', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">APP_PORT + app.port (expose & mapping)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Enable Debug */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="docker-enableDebug"
                checked={dockerConfig.enableDebug}
                onCheckedChange={(checked) => onUpdateConfig('docker.enableDebug', checked)}
              />
              <Label htmlFor="docker-enableDebug">Activer le debug</Label>
            </div>
            <p className="text-sm text-muted-foreground">JAVA_DEBUG</p>
          </div>

          {/* Debug Port (visible si debug=true) */}
          {dockerConfig.enableDebug && (
            <div className="space-y-2">
              <Label htmlFor="docker-debugPort">Port de debug</Label>
              <Input
                id="docker-debugPort"
                type="number"
                value={dockerConfig.debugPort}
                onChange={(e) => onUpdateConfig('docker.debugPort', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">DEBUG_PORT</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Name */}
          <div className="space-y-2">
            <Label htmlFor="docker-imageName">Nom/tag de l'image</Label>
            <Input
              id="docker-imageName"
              value={dockerConfig.imageName}
              onChange={(e) => onUpdateConfig('docker.imageName', e.target.value)}
              placeholder="mon-app:java17"
            />
            <p className="text-sm text-muted-foreground">Pour podman build/run</p>
          </div>
        </div>

        {/* Jar Pattern */}
        <div className="space-y-2">
          <Label htmlFor="docker-jarPattern">Pattern du JAR</Label>
          <Input
            id="docker-jarPattern"
            value={dockerConfig.jarPattern}
            onChange={(e) => onUpdateConfig('docker.jarPattern', e.target.value)}
            readOnly
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">JAR_FILE (read-only ou avancé)</p>
        </div>
      </CardContent>
    </Card>
  );
};