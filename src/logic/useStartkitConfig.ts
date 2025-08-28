import { useState } from 'react';
import type { StartkitConfig, Field, Aggregate } from '@/domain/types';

// Nouvelle structure d'entité
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

const DEFAULT_CONFIG: StartkitConfig = {
  microserviceName: 'ms-adresse-core',
  groupId: 'fr.assia.adresse',
  version: '0.1.0-SNAPSHOT',
  rootPackage: 'fr.assia.adresse',
  artifactId: 'ms-adresse-core',
  javaVersion: 17,
  diFramework: 'spring',
  description: 'Microservice de gestion des adresses',
  modules: {
    coverage: true,
    postgresProvider: false,
    externalApiProvider: false
  },
  domain: {
    aggregates: [
      {
        name: 'Adresse',
        fields: [
          { name: 'id', type: 'UUID', constraints: ['not null'] },
          { name: 'rue', type: 'String', constraints: ['not null'] },
          { name: 'ville', type: 'String', constraints: ['not null'] },
          { name: 'codePostal', type: 'String', constraints: ['not null'] }
        ],
        useCases: ['Sauvegarder', 'Modifier', 'Supprimer', 'Lire']
      }
    ]
  },
  springProfiles: ['dev', 'prod'],
  serverPort: 8080,
  docker: {
    appPort: 8080,
    enableDebug: false,
    debugPort: 5005,
    imageName: 'ms-adresse-core:java17',
    jarPattern: 'target/*.jar'
  }
};

export const useStartkitConfig = () => {
  const [config, setConfig] = useState<StartkitConfig>(() => {
    return { ...DEFAULT_CONFIG };
  });
  
  // État pour les entités avec la nouvelle structure
  const [parsedEntities, setParsedEntities] = useState<NewEntityStructure[]>([]);

  const updateConfig = (path: string, value: unknown) => {
    setConfig(prev => {
      const newConfig = structuredClone(prev);
      const keys = path.split('.');
      let current: Record<string, unknown> = newConfig as unknown as Record<string, unknown>;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
      
      return newConfig;
    });
  };

  const addAggregate = () => {
    const newAggregate: Aggregate = {
      name: 'NouvelAggregate',
      fields: [{ name: 'id', type: 'UUID', constraints: ['not null'] }],
      useCases: ['Sauvegarder', 'Modifier', 'Supprimer']
    };
    
    setConfig(prev => ({
      ...prev,
      domain: {
        ...prev.domain,
        aggregates: [...prev.domain.aggregates, newAggregate]
      }
    }));
  };

  const removeAggregate = (index: number) => {
    setConfig(prev => ({
      ...prev,
      domain: {
        ...prev.domain,
        aggregates: prev.domain.aggregates.filter((_, i) => i !== index)
      }
    }));
  };

  const addField = (aggregateIndex: number) => {
    const newField: Field = { name: 'nouveauChamp', type: 'String', constraints: [] };
    setConfig(prev => {
      const newConfig = structuredClone(prev);
      newConfig.domain.aggregates[aggregateIndex].fields.push(newField);
      return newConfig;
    });
  };

  const removeField = (aggregateIndex: number, fieldIndex: number) => {
    setConfig(prev => {
      const newConfig = structuredClone(prev);
      newConfig.domain.aggregates[aggregateIndex].fields.splice(fieldIndex, 1);
      return newConfig;
    });
  };

  const addSpringProfile = (profile: string) => {
    if (profile.trim() && !config.springProfiles.includes(profile.trim())) {
      setConfig(prev => ({
        ...prev,
        springProfiles: [...prev.springProfiles, profile.trim()]
      }));
    }
  };

  const removeSpringProfile = (index: number) => {
    setConfig(prev => ({
      ...prev,
      springProfiles: prev.springProfiles.filter((_, i) => i !== index)
    }));
  };


  const resetConfig = () => {
    const cleanConfig = structuredClone(DEFAULT_CONFIG);
    setConfig(cleanConfig);
    setParsedEntities([]);
  };

  const updateParsedEntities = (entities: NewEntityStructure[]) => {
    setParsedEntities(entities);
  };

  const setConfigData = (newConfig: StartkitConfig) => {
    setConfig(newConfig);
  };

  return {
    config,
    updateConfig,
    setConfigData,
    addAggregate,
    removeAggregate,
    addField,
    removeField,
    addSpringProfile,
    removeSpringProfile,
    resetConfig,
    // Nouvelles fonctions pour les entités
    parsedEntities,
    updateParsedEntities
  };
};