import { useState, useCallback } from 'react';
import type { StartkitConfig } from '@/domain/config';
import { DEFAULT_CONFIG } from '../services/configDefaults';
import { ConfigUpdater } from '../services/configUpdater';
import { useAggregateActions } from './useAggregateActions';
import { useFieldActions } from './useFieldActions';
import { useProfileActions } from './useProfileActions';

export const useStartkitConfig = () => {
  const [config, setConfig] = useState<StartkitConfig>(DEFAULT_CONFIG);

  const updateConfig = useCallback((path: string, value: unknown) => {
    setConfig(prev => ConfigUpdater.updateConfig(prev, path, value));
  }, []);

  const aggregateActions = useAggregateActions(updateConfig);
  const fieldActions = useFieldActions(updateConfig);
  const profileActions = useProfileActions(updateConfig);

  // Wrapper functions to maintain compatibility
  const addAggregate = useCallback(() => {
    aggregateActions.addAggregate();
  }, [aggregateActions]);

  const removeAggregate = useCallback((index: number) => {
    aggregateActions.removeAggregate(config.domain.aggregates, index);
  }, [aggregateActions, config.domain.aggregates]);

  const addField = useCallback((aggregateIndex: number) => {
    const currentFields = config.domain.aggregates[aggregateIndex].fields;
    fieldActions.addField(aggregateIndex, currentFields);
  }, [fieldActions, config.domain.aggregates]);

  const removeField = useCallback((aggregateIndex: number, fieldIndex: number) => {
    const currentFields = config.domain.aggregates[aggregateIndex].fields;
    fieldActions.removeField(aggregateIndex, fieldIndex, currentFields);
  }, [fieldActions, config.domain.aggregates]);

  const addSpringProfile = useCallback((profile: string) => {
    profileActions.addSpringProfile(config.springProfiles, profile);
  }, [profileActions, config.springProfiles]);

  const removeSpringProfile = useCallback((index: number) => {
    profileActions.removeSpringProfile(config.springProfiles, index);
  }, [profileActions, config.springProfiles]);


  return {
    config,
    updateConfig,
    addAggregate,
    removeAggregate,
    addField,
    removeField,
    addSpringProfile,
    removeSpringProfile
  };
};