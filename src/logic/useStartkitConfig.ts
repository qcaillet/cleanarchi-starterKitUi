import { useState } from 'react';
import type { StartkitConfig, Field, Aggregate } from '@/domain/types';

const DEFAULT_CONFIG: StartkitConfig = {
  microserviceName: 'ms-adresse-core',
  groupId: 'fr.assia.adresse',
  version: '0.1.0-SNAPSHOT',
  artifactId: 'ms-adresse-core',
  javaVersion: 17,
  diFramework: 'spring',
  description: 'Microservice de gestion des adresses',
  modules: {
    coverage: true
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
        useCases: ['Sauvegarder', 'Modifier', 'Supprimer']
      }
    ]
  },
  springProfiles: ['dev', 'prod'],
  serverPort: 8080,
  docker: {
    baseImage: 'azul/openjdk:17-jdk',
    portMapping: '8080:8080',
    startCommand: 'java -jar app.jar'
  }
};

export const useStartkitConfig = () => {
  const [config, setConfig] = useState<StartkitConfig>(() => {
    return { ...DEFAULT_CONFIG };
  });

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = structuredClone(prev);
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
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
    console.log('🔄 Réinitialisation de la configuration...');
    const cleanConfig = structuredClone(DEFAULT_CONFIG);
    console.log('✅ Nouvelle configuration:', cleanConfig);
    setConfig(cleanConfig);
  };

  return {
    config,
    updateConfig,
    addAggregate,
    removeAggregate,
    addField,
    removeField,
    addSpringProfile,
    removeSpringProfile,
    resetConfig
  };
};