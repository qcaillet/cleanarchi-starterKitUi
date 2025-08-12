import { useCallback } from 'react';
import type { Aggregate } from '@/domain/config';

export const useAggregateActions = (
  updateConfig: (path: string, value: unknown) => void
) => {
  const addAggregate = useCallback(() => {
    const newAggregate: Aggregate = {
      name: 'NouvelAggregate',
      fields: [{ name: 'id', type: 'UUID', constraints: ['not null'] }],
      useCases: ['Sauvegarder']
    };
    
    updateConfig('domain.aggregates', newAggregate);
  }, [updateConfig]);

  const updateAggregate = useCallback((index: number, field: string, value: unknown) => {
    updateConfig(`domain.aggregates.${index}.${field}`, value);
  }, [updateConfig]);

  const removeAggregate = useCallback((aggregates: Aggregate[], index: number) => {
    const newAggregates = aggregates.filter((_, i) => i !== index);
    updateConfig('domain.aggregates', newAggregates);
  }, [updateConfig]);

  return {
    addAggregate,
    updateAggregate,
    removeAggregate
  };
};