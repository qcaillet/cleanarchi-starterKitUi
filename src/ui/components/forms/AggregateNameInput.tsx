import React from 'react';
import { Input } from '@/components/ui/input';

interface AggregateNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AggregateNameInput: React.FC<AggregateNameInputProps> = ({
  value,
  onChange
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-semibold text-lg"
      placeholder="Nom de l'agrégat"
    />
  );
};