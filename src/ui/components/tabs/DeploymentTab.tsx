import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StartkitConfig } from '@/domain/types';

interface DeploymentTabProps {
  config: StartkitConfig;
  onUpdateConfig: (path: string, value: unknown) => void;
}

export const DeploymentTab: React.FC<DeploymentTabProps> = ({
  config,
  onUpdateConfig
}) => {

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Spring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serverPort">Port du serveur</Label>
            <Input
              id="serverPort"
              type="number"
              value={config.serverPort}
              onChange={(e) => onUpdateConfig('serverPort', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Docker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseImage">Image de base</Label>
              <Input
                id="baseImage"
                value={config.docker.baseImage}
                onChange={(e) => onUpdateConfig('docker.baseImage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portMapping">Mapping des ports</Label>
              <Input
                id="portMapping"
                value={config.docker.portMapping}
                onChange={(e) => onUpdateConfig('docker.portMapping', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startCommand">Commande de démarrage</Label>
            <Input
              id="startCommand"
              value={config.docker.startCommand}
              onChange={(e) => onUpdateConfig('docker.startCommand', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};