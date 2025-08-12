import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import type { Field, JavaType } from '@/domain/config';

interface FieldRowProps {
  field: Field;
  fieldIndex: number;
  aggregateIndex: number;
  onUpdateField: (aggregateIndex: number, fieldIndex: number, field: Partial<Field>) => void;
  onRemoveField: (aggregateIndex: number, fieldIndex: number) => void;
}

const javaTypes: JavaType[] = [
  'String', 'UUID', 'BigDecimal', 'Integer', 'Long', 'Boolean', 
  'Instant', 'LocalDate', 'LocalDateTime'
];

const availableConstraints = [
  'not null',
  'unique',
  'primary key',
  'auto increment',
  'default value',
  'foreign key',
  'check constraint',
  'index'
];

export const FieldRow: React.FC<FieldRowProps> = ({
  field,
  fieldIndex,
  aggregateIndex,
  onUpdateField,
  onRemoveField
}) => {
  const isNumericType = (type: string): boolean => {
    return ['Integer', 'Long', 'BigDecimal'].includes(type);
  };

  const isConstraintDisabled = (constraint: string): boolean => {
    const hasPrimaryKey = field.constraints.includes('primary key');
    
    switch (constraint) {
      case 'not null':
      case 'unique':
        return hasPrimaryKey;
      case 'auto increment':
        return !isNumericType(field.type);
      case 'foreign key':
        return hasPrimaryKey;
      case 'primary key':
        return field.constraints.includes('foreign key');
      default:
        return false;
    }
  };

  const handleConstraintChange = (constraint: string, checked: boolean) => {
    let updatedConstraints: string[];
    
    if (checked) {
      updatedConstraints = [...field.constraints, constraint];
      
      // Si on sélectionne primary key, on retire not null et unique (redondants)
      if (constraint === 'primary key') {
        updatedConstraints = updatedConstraints.filter(c => 
          c !== 'not null' && c !== 'unique'
        );
      }
      // Si on sélectionne foreign key, on retire primary key
      else if (constraint === 'foreign key') {
        updatedConstraints = updatedConstraints.filter(c => c !== 'primary key');
      }
    } else {
      updatedConstraints = field.constraints.filter(c => c !== constraint);
    }
    
    onUpdateField(aggregateIndex, fieldIndex, { constraints: updatedConstraints });
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-3">
        <Input
          placeholder="Nom du champ"
          value={field.name}
          onChange={(e) => onUpdateField(aggregateIndex, fieldIndex, { name: e.target.value })}
        />
      </div>
      <div className="col-span-3">
        <Select
          value={field.type}
          onValueChange={(value) => onUpdateField(aggregateIndex, fieldIndex, { type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {javaTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Contraintes:</p>
          <div className="grid grid-cols-2 gap-2">
            {availableConstraints.map((constraint) => {
              const disabled = isConstraintDisabled(constraint);
              return (
                <div key={constraint} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${aggregateIndex}-${fieldIndex}-${constraint}`}
                    checked={field.constraints.includes(constraint)}
                    disabled={disabled}
                    onCheckedChange={(checked) => handleConstraintChange(constraint, !!checked)}
                  />
                  <label
                    htmlFor={`${aggregateIndex}-${fieldIndex}-${constraint}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {constraint}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemoveField(aggregateIndex, fieldIndex)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};