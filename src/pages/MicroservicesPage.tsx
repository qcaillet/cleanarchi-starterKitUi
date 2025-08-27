import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Hammer, GitBranch, Plus, Database, Terminal, Bug } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { AddMicroserviceDialog } from "@/components/internal/AddMicroserviceDialog";
import { ConsoleDialog } from "@/components/internal/ConsoleDialog";

interface Microservice {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'building' | 'pulling';
  port: number;
  debugPort?: number;
  debugEnabled: boolean;
  lastUpdated: string;
  framework: string;
  javaVersion: string;
  hasDatabase: boolean;
  databaseName?: string;
}

const MOCK_MICROSERVICES: Microservice[] = [
  {
    id: '1',
    name: 'ms-commande',
    description: 'Service de gestion des commandes',
    status: 'running',
    port: 8080,
    debugPort: 5005,
    debugEnabled: true,
    lastUpdated: '2024-01-15',
    framework: 'Spring Boot',
    javaVersion: '17',
    hasDatabase: true,
    databaseName: 'db_commande'
  },
  {
    id: '2',
    name: 'ms-payment',
    description: 'Service de paiement',
    status: 'stopped',
    port: 8081,
    debugPort: 5006,
    debugEnabled: false,
    lastUpdated: '2024-01-14',
    framework: 'Spring Boot',
    javaVersion: '17',
    hasDatabase: false
  },
  {
    id: '3',
    name: 'ms-user',
    description: 'Service de gestion des utilisateurs',
    status: 'running',
    port: 8082,
    debugPort: 5007,
    debugEnabled: true,
    lastUpdated: '2024-01-15',
    framework: 'Spring Boot',
    javaVersion: '21',
    hasDatabase: true,
    databaseName: 'db_user'
  }
];

const statusConfig = {
  running: { color: 'bg-green-500', text: 'En cours' },
  stopped: { color: 'bg-red-500', text: 'Arrêté' },
  building: { color: 'bg-yellow-500', text: 'Construction' },
  pulling: { color: 'bg-blue-500', text: 'Téléchargement' }
};

export default function MicroservicesPage() {
  const [microservices, setMicroservices] = useState<Microservice[]>(MOCK_MICROSERVICES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConsoleDialogOpen, setIsConsoleDialogOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] = useState<Microservice | null>(null);
  const { toast } = useToast();

  const handleAction = (id: string, action: string) => {
    setMicroservices(prev => 
      prev.map(ms => 
        ms.id === id 
          ? { 
              ...ms, 
              status: action === 'start' ? 'running' : 
                     action === 'stop' ? 'stopped' :
                     action === 'build' ? 'building' :
                     action === 'pull' ? 'pulling' : ms.status
            }
          : ms
      )
    );
  };

  const handleAddMicroservice = (newMicroserviceData: {
    name: string;
    description: string;
    port: number;
    includeDatabase: boolean;
    databaseName: string;
    framework: string;
    javaVersion: string;
  }) => {
    const newMicroservice: Microservice = {
      id: Date.now().toString(),
      name: newMicroserviceData.name,
      description: newMicroserviceData.description,
      status: 'stopped',
      port: newMicroserviceData.port,
      debugPort: 5005,
      debugEnabled: false,
      lastUpdated: new Date().toISOString().split('T')[0],
      framework: newMicroserviceData.framework === 'spring-boot' ? 'Spring Boot' : newMicroserviceData.framework,
      javaVersion: newMicroserviceData.javaVersion,
      hasDatabase: newMicroserviceData.includeDatabase,
      databaseName: newMicroserviceData.includeDatabase ? newMicroserviceData.databaseName : undefined
    };

    setMicroservices(prev => [...prev, newMicroservice]);
    
    toast({
      title: "Microservice créé",
      description: `${newMicroservice.name} a été ajouté avec succès${newMicroservice.hasDatabase ? ' avec sa base de données PostgreSQL' : ''}.`,
    });
  };

  const handleOpenConsole = (microservice: Microservice) => {
    setSelectedMicroservice(microservice);
    setIsConsoleDialogOpen(true);
  };

  const handleToggleDebug = (id: string) => {
    setMicroservices(prev => 
      prev.map(ms => 
        ms.id === id 
          ? { ...ms, debugEnabled: !ms.debugEnabled }
          : ms
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des composants applicatifs</h1>
          <p className="text-muted-foreground">
            Gérez vos composants applicatifs : démarrage, arrêt, construction et déploiement
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau composant applicatif
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {microservices.map((microservice) => (
          <Card key={microservice.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{microservice.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${statusConfig[microservice.status].color}`}
                  />
                  <Badge variant="outline">
                    {statusConfig[microservice.status].text}
                  </Badge>
                  {microservice.debugEnabled && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bug className="h-3 w-3" />
                      Debug
                    </Badge>
                  )}
                  {microservice.hasDatabase && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      DB
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>{microservice.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Port:</span>
                  <span>{microservice.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framework:</span>
                  <span>{microservice.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Java:</span>
                  <span>{microservice.javaVersion}</span>
                </div>
                {microservice.debugPort && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Debug:</span>
                    <span className="flex items-center gap-1">
                      {microservice.debugPort}
                      <div className={`w-1.5 h-1.5 rounded-full ${microservice.debugEnabled ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    </span>
                  </div>
                )}
                {microservice.hasDatabase && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base:</span>
                    <span>{microservice.databaseName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAJ:</span>
                  <span>{microservice.lastUpdated}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 flex-wrap">
              {microservice.status === 'running' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction(microservice.id, 'stop')}
                >
                  <Square className="mr-1 h-3 w-3" />
                  Arrêter
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction(microservice.id, 'start')}
                >
                  <Play className="mr-1 h-3 w-3" />
                  Démarrer
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleOpenConsole(microservice)}
              >
                <Terminal className="mr-1 h-3 w-3" />
                Console
              </Button>

              {microservice.debugPort && (
                <Button 
                  variant={microservice.debugEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleDebug(microservice.id)}
                >
                  <Bug className="mr-1 h-3 w-3" />
                  Debug
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAction(microservice.id, 'pull')}
              >
                <GitBranch className="mr-1 h-3 w-3" />
                Pull
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAction(microservice.id, 'build')}
              >
                <Hammer className="mr-1 h-3 w-3" />
                Build
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>

        <AddMicroserviceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddMicroservice}
        />

        {selectedMicroservice && (
          <ConsoleDialog
            open={isConsoleDialogOpen}
            onOpenChange={setIsConsoleDialogOpen}
            microserviceName={selectedMicroservice.name}
            microserviceStatus={selectedMicroservice.status}
          />
        )}
      </div>
    );
  }