import { useToast } from '@/hooks/use-toast';
import type { StartkitConfig } from '@/domain/config';
import { startkitConfigSchema } from '@/domain/validation';

export const useConfigActions = () => {
  const { toast } = useToast();

  const validateConfig = (config: StartkitConfig) => {
    try {
      startkitConfigSchema.parse(config);
      return { isValid: true, errors: [] };
    } catch (error: un) {
      const errors = error.errors?.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message
      })) || [];
      return { isValid: false, errors };
    }
  };

  const copyToClipboard = (config: StartkitConfig) => {
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      toast({
        title: "Configuration copiée",
        description: "La configuration JSON a été copiée dans le presse-papiers",
      });
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier la configuration",
        variant: "destructive"
      });
    });
  };

  const downloadConfig = (config: StartkitConfig) => {
    const validation = validateConfig(config);
    
    if (!validation.isValid) {
      toast({
        title: "Configuration invalide",
        description: `${validation.errors.length} erreur(s) détectée(s)`,
        variant: "destructive"
      });
      return;
    }

    try {
      const json = JSON.stringify(config, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.microserviceName}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Configuration téléchargée",
        description: "Le fichier de configuration a été téléchargé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la configuration",
        variant: "destructive"
      });
    }
  };

  const importConfig = (file: File): Promise<StartkitConfig> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const validated = startkitConfigSchema.parse(parsed) as StartkitConfig;
          resolve(validated);
          
          toast({
            title: "Configuration importée",
            description: "La configuration a été importée avec succès",
          });
        } catch (error) {
          toast({
            title: "Erreur d'import",
            description: "Fichier de configuration invalide",
            variant: "destructive"
          });
          reject(error);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier",
          variant: "destructive"
        });
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  return {
    validateConfig,
    copyToClipboard,
    downloadConfig,
    importConfig
  };
};