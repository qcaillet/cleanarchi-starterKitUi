import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Database, Globe } from 'lucide-react';
import type { StartkitConfig } from '@/domain/types';

interface ModulesTabProps {
  config: StartkitConfig;
  onUpdateConfig: (path: string, value: unknown) => void;
}


export const ModulesTab: React.FC<ModulesTabProps> = ({ 
  config, 
  onUpdateConfig
}) => {
  const providers = [
    {
      id: 'postgresProvider',
      key: 'modules.postgresProvider',
      title: 'Provider PostgreSQL',
      description: 'Configuration automatique de PostgreSQL avec Spring Data JPA',
      icon: Database,
      checked: config.modules.postgresProvider,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'externalApiProvider',
      key: 'modules.externalApiProvider',
      title: 'Provider API externe',
      description: 'Client REST configuré avec OpenFeign ou RestTemplate',
      icon: Globe,
      checked: config.modules.externalApiProvider,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules/DataProviders</CardTitle>
        <CardDescription>Activez les modules nécessaires pour votre projet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Providers - Style designé */}
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <div
              key={provider.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                provider.checked 
                  ? provider.color
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2 mt-1">
                  <Checkbox
                    id={provider.id}
                    checked={provider.checked}
                    onCheckedChange={(checked) => onUpdateConfig(provider.key, checked)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-4 w-4 ${provider.checked ? 'text-current' : 'text-muted-foreground'}`} />
                    <Label 
                      htmlFor={provider.id}
                      className={`font-medium cursor-pointer ${provider.checked ? 'text-current' : 'text-foreground'}`}
                    >
                      {provider.title}
                    </Label>
                    {provider.checked && (
                      <Badge variant="secondary" className="text-xs">
                        Activé
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${provider.checked ? 'text-current opacity-90' : 'text-muted-foreground'}`}>
                    {provider.description}
                  </p>

                  {/* Champ nom pour l'API externe */}
                  {provider.id === 'externalApiProvider' && provider.checked && (
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <Label htmlFor="externalApiName" className="text-xs font-medium text-current opacity-80 mb-1 block">
                        Nom de l'API
                      </Label>
                      <Input
                        id="externalApiName"
                        value={config.modules.externalApiName || ''}
                        onChange={(e) => onUpdateConfig('modules.externalApiName', e.target.value)}
                        placeholder="DataGouvAPI"
                        className="h-8 text-sm bg-white/50 border-current border-opacity-30 focus:border-current focus:ring-current focus:ring-opacity-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
      </CardContent>
    </Card>
  );
};