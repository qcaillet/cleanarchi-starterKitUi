import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Download, AlertCircle } from 'lucide-react';
import { useStartkitConfig } from '@/logic/useStartkitConfig';
import { useProjectGenerator } from '@/logic/hooks/useProjectGenerator';
import { useElectronIntegration } from '@/hooks/useElectron';
import type { StartkitConfig } from '@/domain/types';
import { GeneralTab } from './components/tabs/GeneralTab';
import { ModulesTab } from './components/tabs/ModulesTab';
import { DomainTab } from './components/tabs/DomainTab';
import { DeploymentTab } from './components/tabs/DeploymentTab';

const StartKitGenerator: React.FC = () => {
  const {
    config,
    updateConfig,
    setConfigData,
    addAggregate,
    removeAggregate,
    addField,
    removeField,
    resetConfig,
    parsedEntities,
    updateParsedEntities
  } = useStartkitConfig();

  const { isGenerating, error, generateProject, clearError } = useProjectGenerator();
  
  const { isElectron, saveConfig, loadConfig } = useElectronIntegration({
    onNewProject: () => {
      resetConfig();
    },
    onSaveConfig: () => handleSaveConfig(),
    onOpenConfig: () => handleLoadConfig(),
    onExportProject: () => handleGenerateProject()
  });
  const handleSaveConfig = async () => {
    if (!isElectron) return;
    
    try {
      const result = await saveConfig(config);
      if (!result.success && !result.cancelled) {
        console.error('Erreur sauvegarde:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleLoadConfig = async () => {
    if (!isElectron) return;
    
    try {
      const result = await loadConfig();
      if (result.success && result.data) {
        setConfigData(result.data as StartkitConfig);
      } else if (!result.cancelled) {
        console.error('Erreur chargement:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };


  const handleGenerateProject = async () => {
    try {
      clearError();
      await generateProject(config, parsedEntities);
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Clean architecture Startkit
          </h1>
          <p className="text-muted-foreground text-lg">
            Configurez vos composants applicatifs en clean architecture
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="modules">Modules/Dataproviders</TabsTrigger>
            <TabsTrigger value="domain">Domaine</TabsTrigger>
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralTab config={config} onUpdateConfig={updateConfig} />
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <ModulesTab 
              config={config} 
              onUpdateConfig={updateConfig}
            />
          </TabsContent>

          <TabsContent value="domain" className="space-y-6">
            <DomainTab
              config={config}
              onUpdateConfig={updateConfig}
              onAddAggregate={addAggregate}
              onRemoveAggregate={removeAggregate}
              onAddField={addField}
              onRemoveField={removeField}
              onImportNewEntities={updateParsedEntities}
            />
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <DeploymentTab
              config={config}
              onUpdateConfig={updateConfig}
            />
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-6 right-6 flex gap-3">
          <Button 
            onClick={resetConfig}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
          <Button 
            onClick={handleGenerateProject}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Génération...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {isElectron ? 'Télécharger' : 'Télécharger'}
              </>
            )}
          </Button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="fixed bottom-20 right-6 max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800">Erreur de génération</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Fermer</span>
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default StartKitGenerator;