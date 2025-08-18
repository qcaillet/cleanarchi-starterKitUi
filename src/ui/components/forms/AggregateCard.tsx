import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FieldsImport } from './FieldsImport';
import { AggregateNameInput } from './AggregateNameInput';
import { AggregateFormActions } from './AggregateFormActions';
import { AggregateTextAreas } from './AggregateTextAreas';
import { Trash2 } from 'lucide-react';
import type { Aggregate, Field } from '@/domain/config';

interface AggregateCardProps {
  aggregate: Aggregate;
  aggregateIndex: number;
  onUpdateAggregate: (index: number, field: string, value: unknown) => void;
  onRemoveAggregate: (index: number) => void;
  onAddField: (aggregateIndex: number) => void;
  onUpdateField: (aggregateIndex: number, fieldIndex: number, field: Partial<Field>) => void;
  onRemoveField: (aggregateIndex: number, fieldIndex: number) => void;
  onImportNewEntities?: (entities: any[]) => void;
}

export const AggregateCard: React.FC<AggregateCardProps> = ({
  aggregate,
  aggregateIndex,
  onUpdateAggregate,
  onRemoveAggregate,
  onAddField,
  onUpdateField,
  onRemoveField,
  onImportNewEntities
}) => {
  const handleArrayUpdate = (field: string, value: string) => {
    const arrayValue = value.split('\n').filter(item => item.trim());
    onUpdateAggregate(aggregateIndex, field, arrayValue);
  };

  const handleImportFields = (importedFields: Field[]) => {
    // Remplace tous les champs existants par les champs importés
    onUpdateAggregate(aggregateIndex, 'fields', importedFields);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <AggregateNameInput
            value={aggregate.name}
            onChange={(value) => onUpdateAggregate(aggregateIndex, 'name', value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemoveAggregate(aggregateIndex)}
            className="flex items-center gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Champs</Label>
          <div className="space-y-4">
            <FieldsImport 
              onImportFields={handleImportFields} 
              onImportNewEntities={onImportNewEntities}
              currentFields={aggregate.fields}
            />
          </div>
        </div>

        <AggregateTextAreas
          useCases={aggregate.useCases}
          aggregateName={aggregate.name}
          onUpdateArray={handleArrayUpdate}
        />
      </CardContent>
    </Card>
  );
};