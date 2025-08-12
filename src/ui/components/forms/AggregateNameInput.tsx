import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AggregateNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AggregateNameInput: React.FC<AggregateNameInputProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs">
        Agrégat
      </Badge>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-semibold text-lg flex-1"
        placeholder="Nom de l'agrégat"
      />
    </div>
  );
};