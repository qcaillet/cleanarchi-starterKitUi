import { useState } from 'react';
import { projectGeneratorService } from '@/logic/services/projectGeneratorService';
import type { StartkitConfig } from '@/domain/config';

interface UseProjectGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  generateProject: (config: StartkitConfig) => Promise<void>;
  checkApiHealth: () => Promise<boolean>;
  clearError: () => void;
}

export const useProjectGenerator = (): UseProjectGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProject = async (config: StartkitConfig): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validation basique
      if (!config.domain.aggregates || config.domain.aggregates.length === 0) {
        throw new Error('Au moins un agrégat est requis pour générer le projet');
      }

      if (!config.microserviceName || config.microserviceName.trim() === '') {
        throw new Error('Le nom du microservice est requis');
      }


      // Appel du service
      await projectGeneratorService.generateAndDownloadProject(config);
      
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