import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AggregateTextAreasProps {
  useCases: string[];
  aggregateName: string;
  onUpdateArray: (field: string, value: string) => void;
}

const availableUseCases = [
  'Sauvegarder',
  'Modifier',
  'Supprimer',
  'Lire'
];

export const AggregateTextAreas: React.FC<AggregateTextAreasProps> = ({
  useCases,
  onUpdateArray
}) => {
  const [selectValue, setSelectValue] = React.useState<string>('');

  const handleUseCaseAdd = (useCase: string) => {
    if (!useCases.includes(useCase)) {
      const updatedUseCases = [...useCases, useCase];
      onUpdateArray('useCases', updatedUseCases.join('\n'));
    }
    setSelectValue(''); // Reset le select
  };

  const handleUseCaseRemove = (useCaseToRemove: string) => {
    const updatedUseCases = useCases.filter(uc => uc !== useCaseToRemove);
    onUpdateArray('useCases', updatedUseCases.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Cas d'usage</Label>
        <div className="mt-2 space-y-3">
          <Select value={selectValue} onValueChange={handleUseCaseAdd}>
            <SelectTrigger>
              <SelectValue placeholder="Ajouter un cas d'usage" />
            </SelectTrigger>
            <SelectContent>
              {availableUseCases
                .filter(useCase => !useCases.includes(useCase))
                .map((useCase) => (
                  <SelectItem key={useCase} value={useCase}>
                    {useCase}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {useCases.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {useCases.map((useCase, index) => (
                <Badge key={`${useCase}-${index}`} variant="secondary" className="flex items-center gap-1">
                  {useCase}
                  <button
                    type="button"
                    className="ml-1 hover:text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUseCaseRemove(useCase);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};