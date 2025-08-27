import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Save, Database, Server, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceConfig {
  id: string;
  serviceName: string;
  location: 'local' | 'nexus';
  nexusUrl?: string;
  hasDatabase: boolean;
  databaseConfig?: {
    location: 'local' | 'server';
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  };
  environmentVariables: EnvironmentVariable[];
}

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description?: string;
}

const MOCK_SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: '1',
    serviceName: 'ms-commande',
    location: 'local',
    hasDatabase: true,
    databaseConfig: {
      location: 'local'
    },
    environmentVariables: [
      {
        id: '1',
        key: 'SERVER_PORT',
        value: '8080',
        description: 'Port du serveur'
      }
    ]
  },
  {
    id: '2',
    serviceName: 'ms-payment',
    location: 'nexus',
    nexusUrl: 'https://nexus.monentreprise.com/repository/maven-public/',
    hasDatabase: false,
    environmentVariables: [
      {
        id: '2',
        key: 'PAYMENT_API_URL',
        value: 'https://api.payment.com',
        description: 'URL de l\'API de paiement'
      }
    ]
  },
  {
    id: '3',
    serviceName: 'ms-user',
    location: 'local',
    hasDatabase: true,
    databaseConfig: {
      location: 'server',
      host: 'db.monentreprise.com',
      port: 5432,
      database: 'users_prod',
      username: 'app_user',
      password: '****'
    },
    environmentVariables: []
  }
];

export default function ConfigPage() {
  const [servicesConfig, setServicesConfig] = useState<ServiceConfig[]>(MOCK_SERVICES_CONFIG);
  const [selectedService, setSelectedService] = useState<string>(MOCK_SERVICES_CONFIG[0]?.id || '');
  const { toast } = useToast();

  const getCurrentService = () => servicesConfig.find(s => s.id === selectedService);

  const updateServiceConfig = (serviceId: string, updates: Partial<ServiceConfig>) => {
    setServicesConfig(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, ...updates } : service
      )
    );
  };

  const updateDatabaseConfig = (serviceId: string, dbConfig: Partial<NonNullable<ServiceConfig['databaseConfig']>>) => {
    setServicesConfig(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              databaseConfig: { 
                location: 'local' as const,
                ...service.databaseConfig, 
                ...dbConfig 
              } 
            }
          : service
      )
    );
  };

  const addEnvVar = (serviceId: string) => {
    const newVar: EnvironmentVariable = {
      id: Date.now().toString(),
      key: '',
      value: '',
      description: ''
    };
    
    setServicesConfig(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              environmentVariables: [...service.environmentVariables, newVar]
            }
          : service
      )
    );
  };

  const updateEnvVar = (serviceId: string, varId: string, field: keyof EnvironmentVariable, value: string) => {
    setServicesConfig(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? {
              ...service,
              environmentVariables: service.environmentVariables.map(envVar => 
                envVar.id === varId ? { ...envVar, [field]: value } : envVar
              )
            }
          : service
      )
    );
  };

  const deleteEnvVar = (serviceId: string, varId: string) => {
    setServicesConfig(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? {
              ...service,
              environmentVariables: service.environmentVariables.filter(envVar => envVar.id !== varId)
            }
          : service
      )
    );
  };

  const saveConfiguration = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Les configurations des services ont été mises à jour avec succès.",
    });
  };

  const currentService = getCurrentService();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuration des Services</h1>
          <p className="text-muted-foreground">
            Gérez la configuration individuelle de chaque microservice
          </p>
        </div>
        <Button onClick={saveConfiguration}>
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder Tout
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Liste des services */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services</CardTitle>
              <CardDescription>Sélectionnez un service à configurer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {servicesConfig.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedService === service.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{service.serviceName}</span>
                    <div className="flex gap-1">
                      <Badge variant={service.location === 'local' ? 'default' : 'secondary'}>
                        {service.location === 'local' ? (
                          <><Server className="h-3 w-3 mr-1" />Local</>
                        ) : (
                          <><Globe className="h-3 w-3 mr-1" />Nexus</>
                        )}
                      </Badge>
                      {service.hasDatabase && (
                        <Badge variant="outline">
                          <Database className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Configuration du service sélectionné */}
        <div className="col-span-9">
          {currentService && (
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">Général</TabsTrigger>
                {currentService.hasDatabase && (
                  <TabsTrigger value="database">Base de données</TabsTrigger>
                )}
                <TabsTrigger value="environment">Variables d'environnement</TabsTrigger>
              </TabsList>

              {/* Onglet Général */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration générale - {currentService.serviceName}</CardTitle>
                    <CardDescription>
                      Définissez l'emplacement et les paramètres de base du service
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="location">Emplacement du service</Label>
                      <Select
                        value={currentService.location}
                        onValueChange={(value: 'local' | 'nexus') => 
                          updateServiceConfig(currentService.id, { location: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4" />
                              Local
                            </div>
                          </SelectItem>
                          <SelectItem value="nexus">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Nexus Repository
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentService.location === 'nexus' && (
                      <div>
                        <Label htmlFor="nexusUrl">URL du Nexus Repository</Label>
                        <Input
                          id="nexusUrl"
                          value={currentService.nexusUrl || ''}
                          onChange={(e) => 
                            updateServiceConfig(currentService.id, { nexusUrl: e.target.value })
                          }
                          placeholder="https://nexus.monentreprise.com/repository/maven-public/"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Base de données */}
              {currentService.hasDatabase && (
                <TabsContent value="database">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Configuration de la base de données
                      </CardTitle>
                      <CardDescription>
                        Configurez la connexion à la base de données PostgreSQL
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="dbLocation">Emplacement de la base de données</Label>
                        <Select
                          value={currentService.databaseConfig?.location || 'local'}
                          onValueChange={(value: 'local' | 'server') => 
                            updateDatabaseConfig(currentService.id, { location: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4" />
                                Local (Docker)
                              </div>
                            </SelectItem>
                            <SelectItem value="server">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Serveur distant
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {currentService.databaseConfig?.location === 'server' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dbHost">Host</Label>
                            <Input
                              id="dbHost"
                              value={currentService.databaseConfig?.host || ''}
                              onChange={(e) => 
                                updateDatabaseConfig(currentService.id, { host: e.target.value })
                              }
                              placeholder="db.monentreprise.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dbPort">Port</Label>
                            <Input
                              id="dbPort"
                              type="number"
                              value={currentService.databaseConfig?.port || 5432}
                              onChange={(e) => 
                                updateDatabaseConfig(currentService.id, { port: parseInt(e.target.value) || 5432 })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="dbName">Base de données</Label>
                            <Input
                              id="dbName"
                              value={currentService.databaseConfig?.database || ''}
                              onChange={(e) => 
                                updateDatabaseConfig(currentService.id, { database: e.target.value })
                              }
                              placeholder="nom_base"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dbUsername">Utilisateur</Label>
                            <Input
                              id="dbUsername"
                              value={currentService.databaseConfig?.username || ''}
                              onChange={(e) => 
                                updateDatabaseConfig(currentService.id, { username: e.target.value })
                              }
                              placeholder="utilisateur"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="dbPassword">Mot de passe</Label>
                            <Input
                              id="dbPassword"
                              type="password"
                              value={currentService.databaseConfig?.password || ''}
                              onChange={(e) => 
                                updateDatabaseConfig(currentService.id, { password: e.target.value })
                              }
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Onglet Variables d'environnement */}
              <TabsContent value="environment">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Variables d'environnement</CardTitle>
                        <CardDescription>
                          Variables spécifiques à {currentService.serviceName}
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={() => addEnvVar(currentService.id)} 
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter Variable
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentService.environmentVariables.map((envVar) => (
                      <div key={envVar.id} className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-3">
                          <Label htmlFor={`key-${envVar.id}`}>Clé</Label>
                          <Input
                            id={`key-${envVar.id}`}
                            value={envVar.key}
                            onChange={(e) => updateEnvVar(currentService.id, envVar.id, 'key', e.target.value)}
                            placeholder="NOM_VARIABLE"
                          />
                        </div>
                        
                        <div className="col-span-3">
                          <Label htmlFor={`value-${envVar.id}`}>Valeur</Label>
                          <Input
                            id={`value-${envVar.id}`}
                            value={envVar.value}
                            onChange={(e) => updateEnvVar(currentService.id, envVar.id, 'value', e.target.value)}
                            placeholder="valeur"
                            type={envVar.key.toLowerCase().includes('password') || envVar.key.toLowerCase().includes('secret') ? 'password' : 'text'}
                          />
                        </div>
                        
                        <div className="col-span-5">
                          <Label htmlFor={`desc-${envVar.id}`}>Description</Label>
                          <Input
                            id={`desc-${envVar.id}`}
                            value={envVar.description || ''}
                            onChange={(e) => updateEnvVar(currentService.id, envVar.id, 'description', e.target.value)}
                            placeholder="Description"
                          />
                        </div>
                        
                        <div className="col-span-1 flex items-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteEnvVar(currentService.id, envVar.id)}
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {currentService.environmentVariables.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune variable d'environnement configurée pour ce service.
                        <br />
                        Cliquez sur "Ajouter Variable" pour commencer.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}