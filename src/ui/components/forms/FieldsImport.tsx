import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Field } from '@/domain/config';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FieldsImportProps {
  onImportFields: (fields: Field[]) => void;
  currentFields?: Field[];
}

export const FieldsImport: React.FC<FieldsImportProps> = ({ onImportFields, currentFields = [] }) => {
  const [jsonInput, setJsonInput] = useState(() => 
    currentFields.length > 0 ? JSON.stringify(currentFields, null, 2) : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingFromFields, setIsUpdatingFromFields] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Synchronise avec les champs actuels seulement si pas en train de saisir JSON
  useEffect(() => {
    if (isUpdatingFromFields) return;
    
    const currentJson = JSON.stringify(currentFields, null, 2);
    // Ne synchronise que si on a des champs ET que le JSON actuel est différent
    // Ou si le JSON actuel est vide et qu'on a des champs
    if (currentFields.length > 0 && currentJson !== jsonInput) {
      setJsonInput(currentJson);
    }
  }, [currentFields, isUpdatingFromFields]);

  // Cleanup du timer au démontage
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);


  const validateAndParseFields = (jsonString: string): Field[] | null => {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Le JSON doit être un tableau de champs');
      }

      const validTypes = ['String', 'UUID', 'BigDecimal', 'Integer', 'Long', 'Boolean', 'Instant', 'LocalDate', 'LocalDateTime'];
      const validConstraints = ['not null', 'unique', 'primary key', 'auto increment', 'default value', 'foreign key', 'check constraint', 'index'];

      return parsed.map((field, index) => {
        if (!field.name || typeof field.name !== 'string') {
          throw new Error(`Champ ${index + 1}: Le nom est requis et doit être une chaîne`);
        }

        if (!field.type || !validTypes.includes(field.type)) {
          throw new Error(`Champ ${index + 1}: Type invalide. Types valides: ${validTypes.join(', ')}`);
        }

        const constraints = field.constraints || [];
        if (!Array.isArray(constraints)) {
          throw new Error(`Champ ${index + 1}: Les contraintes doivent être un tableau`);
        }

        for (const constraint of constraints) {
          if (!validConstraints.includes(constraint)) {
            throw new Error(`Champ ${index + 1}: Contrainte invalide "${constraint}". Contraintes valides: ${validConstraints.join(', ')}`);
          }
        }

        return {
          name: field.name,
          type: field.type,
          constraints: constraints
        };
      });
    } catch (err) {
      return null;
    }
  };

  const handleImport = () => {
    setError(null);
    
    if (!jsonInput.trim()) {
      setError('Veuillez saisir du JSON');
      return;
    }

    const fields = validateAndParseFields(jsonInput);
    
    if (!fields) {
      setError('JSON invalide. Vérifiez le format.');
      return;
    }

    try {
      onImportFields(fields);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'importation');
    }
  };

  // Applique automatiquement les changements JSON valides avec debounce
  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setIsUpdatingFromFields(true);
    
    // Nettoie le timer précédent
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (!value.trim()) {
      setError(null);
      setIsUpdatingFromFields(false);
      return;
    }

    // Débounce pour éviter trop d'appels
    const timeoutId = setTimeout(() => {
      const fields = validateAndParseFields(value);
      
      if (fields) {
        setError(null);
        // Applique automatiquement si le JSON est valide
        try {
          onImportFields(fields);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors de l\'application automatique');
        }
      } else {
        setError('JSON invalide');
      }
      
      setIsUpdatingFromFields(false);
      setDebounceTimer(null);
    }, 500); // Attendre 500ms après la dernière frappe

    setDebounceTimer(timeoutId);
  };



  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Importer des champs depuis JSON</Label>
      </div>
      
      <Textarea
        placeholder={currentFields.length > 0 
          ? "Vos champs actuels (JSON synchronisé)" 
          : "Structure JSON de vos champs apparaîtra ici automatiquement..."
        }
        value={jsonInput}
        onChange={(e) => handleJsonChange(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
    </div>
  );
};