import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AggregateCard } from '../forms/AggregateCard';
import type { StartkitConfig, Field } from '@/domain/config';

interface DomainTabProps {
  config: StartkitConfig;
  onUpdateConfig: (path: string, value: unknown) => void;
  onAddAggregate: () => void;
  onRemoveAggregate: (index: number) => void;
  onAddField: (aggregateIndex: number) => void;
  onRemoveField: (aggregateIndex: number, fieldIndex: number) => void;
  onImportNewEntities?: (entities: {
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
      relation: string;
      collection_type?: string;
      materialize: string;
    }[];
  }[]) => void;
}

export const DomainTab: React.FC<DomainTabProps> = ({
  config,
  onUpdateConfig,
  onAddAggregate,
  onRemoveAggregate,
  onAddField,
  onRemoveField,
  onImportNewEntities
}) => {
  const handleUpdateAggregate = (index: number, field: string, value: unknown) => {
    onUpdateConfig(`domain.aggregates.${index}.${field}`, value);
  };

  const handleUpdateField = (aggregateIndex: number, fieldIndex: number, field: Partial<Field>) => {
    const currentField = config.domain.aggregates[aggregateIndex].fields[fieldIndex];
    const updatedField = { ...currentField, ...field };
    onUpdateConfig(`domain.aggregates.${aggregateIndex}.fields.${fieldIndex}`, updatedField);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={onAddAggregate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un agrégat
        </Button>
      </div>

      {config.domain.aggregates.map((aggregate, index) => (
        <AggregateCard
          key={index}
          aggregate={aggregate}
          aggregateIndex={index}
          onUpdateAggregate={handleUpdateAggregate}
          onRemoveAggregate={onRemoveAggregate}
          onAddField={onAddField}
          onUpdateField={handleUpdateField}
          onRemoveField={onRemoveField}
          onImportNewEntities={onImportNewEntities}
        />
      ))}
    </div>
  );
};