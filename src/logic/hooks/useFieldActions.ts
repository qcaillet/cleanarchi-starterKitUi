import { useCallback } from 'react';
import type { Field } from '@/domain/config';

export const useFieldActions = (
  updateConfig: (path: string, value: unknown) => void
) => {
  const addField = useCallback((aggregateIndex: number, fields: Field[]) => {
    const newField: Field = { name: 'nouveauChamp', type: 'String', constraints: [] };
    const newFields = [...fields, newField];
    updateConfig(`domain.aggregates.${aggregateIndex}.fields`, newFields);
  }, [updateConfig]);

  const updateField = useCallback((aggregateIndex: number, fieldIndex: number, field: Partial<Field>, currentField: Field) => {
    const updatedField = { ...currentField, ...field };
    updateConfig(`domain.aggregates.${aggregateIndex}.fields.${fieldIndex}`, updatedField);
  }, [updateConfig]);

  const removeField = useCallback((aggregateIndex: number, fieldIndex: number, fields: Field[]) => {
    const newFields = fields.filter((_, i) => i !== fieldIndex);
    updateConfig(`domain.aggregates.${aggregateIndex}.fields`, newFields);
  }, [updateConfig]);

  return {
    addField,
    updateField,
    removeField
  };
};