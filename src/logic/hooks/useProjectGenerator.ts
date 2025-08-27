import { useState } from 'react';
import { projectGeneratorService } from '@/logic/services/projectGeneratorService';
import type { StartkitConfig } from '@/domain/config';

// Interface pour la nouvelle structure d'entité
interface NewEntityStructure {
  class: string;
  aggregate_root?: boolean;
  fields: {
    name: string;
    type: string;
    constraints?: string[];
  }[];
  relations?: {
    name: string;
    target: string;
    relation: string;  // "one-to-many", "many-to-one", "one-to-one"
    collection_type?: string;
    materialize: string;  // "embed", "fk", etc.
  }[];
}

interface UseProjectGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  generateProject: (config: StartkitConfig, parsedEntities?: NewEntityStructure[]) => Promise<void>;
  checkApiHealth: () => Promise<boolean>;
  clearError: () => void;
}

export const useProjectGenerator = (): UseProjectGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProject = async (config: StartkitConfig, parsedEntities?: NewEntityStructure[]): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validation basique du nom du microservice
      if (!config.microserviceName || config.microserviceName.trim() === '') {
        throw new Error('Le nom du microservice est requis');
      }

      // Si on a des entités parsées, utiliser la nouvelle structure
      if (parsedEntities && parsedEntities.length > 0) {
        console.log('🎯 Utilisation de la nouvelle structure d\'entités');
        await projectGeneratorService.generateProjectWithNewStructure(config, parsedEntities);
      } else {
        // Sinon, utiliser l'ancienne méthode avec validation des agrégats
        if (!config.domain.aggregates || config.domain.aggregates.length === 0) {
          throw new Error('Au moins un agrégat est requis pour générer le projet');
        }
        console.log('📋 Utilisation de la structure classique');
        await projectGeneratorService.generateAndDownloadProject(config);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la génération';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const checkApiHealth = async (): Promise<boolean> => {
    try {
      return await projectGeneratorService.healthCheck();
    } catch (err) {
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isGenerating,
    error,
    generateProject,
    checkApiHealth,
    clearError
  };
};