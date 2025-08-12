import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldRow } from './FieldRow';
import { FieldsImport } from './FieldsImport';
import { AggregateNameInput } from './AggregateNameInput';
import { AggregateFormActions } from './AggregateFormActions';
import { AggregateTextAreas } from './AggregateTextAreas';
import { Plus, FileJson, Trash2 } from 'lucide-react';
import type { Aggregate, Field } from '@/domain/config';

interface AggregateCardProps {
  aggregate: Aggregate;
  aggregateIndex: number;
  onUpdateAggregate: (index: number, field: string, value: unknown) => void;
  onRemoveAggregate: (index: number) => void;
  onAddField: (aggregateIndex: number) => void;
  onUpdateField: (aggregateIndex: number, fieldIndex: number, field: Partial<Field>) => void;
  onRemoveField: (aggregateIndex: number, fieldIndex: number) => void;
}

export const AggregateCard: React.FC<AggregateCardProps> = ({
  aggregate,
  aggregateIndex,
  onUpdateAggregate,
  onRemoveAggregate,
  onAddField,
  onUpdateField,
  onRemoveField
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
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Création manuelle
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                Import JSON
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddField(aggregateIndex)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un champ
                </Button>
              </div>
              <div className="space-y-3">
                {aggregate.fields.map((field, fieldIndex) => (
                  <FieldRow
                    key={fieldIndex}
                    field={field}
                    fieldIndex={fieldIndex}
                    aggregateIndex={aggregateIndex}
                    onUpdateField={onUpdateField}
                    onRemoveField={onRemoveField}
                  />
                ))}
                {aggregate.fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun champ défini. Cliquez sur "Ajouter un champ" pour commencer.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <FieldsImport 
                onImportFields={handleImportFields} 
                currentFields={aggregate.fields}
              />
              {aggregate.fields.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Champs actuels ({aggregate.fields.length})</Label>
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <div className="space-y-1">
                      {aggregate.fields.map((field, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{field.name}</span>
                          <span className="text-muted-foreground"> ({field.type})</span>
                          {field.constraints.length > 0 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              [{field.constraints.join(', ')}]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
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