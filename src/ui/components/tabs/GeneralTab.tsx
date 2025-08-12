import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StartkitConfig, JavaVersion } from '@/domain/types';

interface GeneralTabProps {
  config: StartkitConfig;
  onUpdateConfig: (path: string, value: unknown) => void;
}

const javaVersions: JavaVersion[] = [11, 17, 21];

export const GeneralTab: React.FC<GeneralTabProps> = ({ config, onUpdateConfig }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
        <CardDescription>Configuration de base du projet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="microserviceName">Nom du projet</Label>
            <Input
              id="microserviceName"
              value={config.microserviceName}
              onChange={(e) => onUpdateConfig('microserviceName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupId">Group ID</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-muted-foreground">
                fr.assia.
              </div>
              <Input
                id="groupId"
                value={config.groupId.replace('fr.assia.', '')}
                onChange={(e) => onUpdateConfig('groupId', `fr.assia.${e.target.value}`)}
                className="rounded-l-none"
                placeholder="exemple"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={config.version}
              onChange={(e) => onUpdateConfig('version', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artifactId">Artifact ID</Label>
            <Input
              id="artifactId"
              value={config.artifactId}
              onChange={(e) => onUpdateConfig('artifactId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="javaVersion">Version Java</Label>
            <Select 
              value={config.javaVersion.toString()} 
              onValueChange={(value) => onUpdateConfig('javaVersion', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {javaVersions.map((version) => (
                  <SelectItem key={version} value={version.toString()}>
                    Java {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={config.description}
            onChange={(e) => onUpdateConfig('description', e.target.value)}
            placeholder="Description du projet"
          />
        </div>
      </CardContent>
    </Card>
  );
};