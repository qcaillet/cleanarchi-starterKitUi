import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AggregateFormActionsProps {
  onAddField: () => void;
  onRemoveAggregate: () => void;
}

export const AggregateFormActions: React.FC<AggregateFormActionsProps> = ({
  onAddField,
  onRemoveAggregate
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddField}
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un champ
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onRemoveAggregate}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};