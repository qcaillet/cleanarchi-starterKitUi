import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Field } from '@/domain/config';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Structure des nouvelles entités
interface NewEntityStructure {
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
    relation: string;  // "one-to-many", "many-to-one", "one-to-one"
    collection_type?: string;
    materialize: string;  // "embed", "fk", etc.
  }[];
}

interface FieldsImportProps {
  onImportFields: (fields: Field[]) => void;
  onImportNewEntities?: (entities: NewEntityStructure[]) => void;
  currentFields?: Field[];
  entitiesJson: string;
  onJsonChange: (json: string) => void;
}

export const FieldsImport: React.FC<FieldsImportProps> = ({ 
  onImportFields, 
  onImportNewEntities,
  currentFields: _currentFields = [],
  entitiesJson,
  onJsonChange
}) => {
  const [error, setError] = useState<string | null>(null);
  const [parsedEntities, setParsedEntities] = useState<NewEntityStructure[] | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Pas de synchronisation automatique - l'utilisateur saisit du JSON

  // Cleanup du timer au démontage
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);


  const validateNewStructure = (jsonString: string): { entities?: NewEntityStructure[], error?: string } => {
    if (!jsonString.trim()) {
      return { entities: [] };
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Le JSON doit être un tableau d\'entités');
      }

      const validTypes = ['String', 'UUID', 'BigDecimal', 'Integer', 'Long', 'Boolean', 'Instant', 'LocalDate', 'LocalDateTime', 'Date'];
      const validRelations = ['one-to-many', 'many-to-one', 'one-to-one'];
      const validMaterializations = ['embed', 'fk'];

      const entities = parsed.map((entity, entityIndex) => {
        // Validation de la classe
        if (!entity.class || typeof entity.class !== 'string') {
          throw new Error(`Entité ${entityIndex + 1}: Le champ 'class' est requis`);
        }

        // Validation des champs
        if (!Array.isArray(entity.fields)) {
          throw new Error(`Entité ${entityIndex + 1}: Le champ 'fields' doit être un tableau`);
        }

        const validatedFields = entity.fields.map((field: { name?: string; type?: string; constraints?: string[] }, fieldIndex: number) => {
          if (!field.name || typeof field.name !== 'string') {
            throw new Error(`Entité ${entityIndex + 1}, Champ ${fieldIndex + 1}: Le nom est requis`);
          }

          if (!field.type || !validTypes.includes(field.type)) {
            throw new Error(`Entité ${entityIndex + 1}, Champ ${fieldIndex + 1}: Type invalide. Types valides: ${validTypes.join(', ')}`);
          }

          return {
            name: field.name,
            type: field.type,
            constraints: field.constraints || []
          };
        });

        // Validation des relations (optionnel)
        let validatedRelations: {
          name: string;
          target: string;
          relation: string;
          collection_type?: string;
          materialize: string;
        }[] = [];
        if (entity.relations && Array.isArray(entity.relations)) {
          validatedRelations = entity.relations.map((relation: { name?: string; target?: string; relation?: string; collection_type?: string; materialize?: string }, relIndex: number) => {
            if (!relation.name || typeof relation.name !== 'string') {
              throw new Error(`Entité ${entityIndex + 1}, Relation ${relIndex + 1}: Le nom est requis`);
            }
            if (!relation.target || typeof relation.target !== 'string') {
              throw new Error(`Entité ${entityIndex + 1}, Relation ${relIndex + 1}: La cible est requise`);
            }
            if (!relation.relation || !validRelations.includes(relation.relation)) {
              throw new Error(`Entité ${entityIndex + 1}, Relation ${relIndex + 1}: Type de relation invalide. Types valides: ${validRelations.join(', ')}`);
            }
            if (!relation.materialize || !validMaterializations.includes(relation.materialize)) {
              throw new Error(`Entité ${entityIndex + 1}, Relation ${relIndex + 1}: Matérialisation invalide. Types valides: ${validMaterializations.join(', ')}`);
            }
            return relation;
          });
        }

        return {
          class: entity.class,
          aggregate_root: Boolean(entity.aggregate_root),
          fields: validatedFields,
          relations: validatedRelations
        };
      });

      return { entities };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'JSON invalide' };
    }
  };


  // Valide et traite la nouvelle structure JSON avec debounce
  const handleJsonChange = (value: string) => {
    onJsonChange(value);
    
    // Nettoie le timer précédent
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    if (!value.trim()) {
      setError(null);
      setParsedEntities(null);
      return;
    }

    // Débounce pour éviter trop de validations
    const timeoutId = setTimeout(() => {
      const { entities, error } = validateNewStructure(value);
      
      if (error) {
        setError(error);
        setParsedEntities(null);
      } else if (entities) {
        setError(null);
        setParsedEntities(entities);
        
        // Appelle la fonction pour stocker les entités dans l'état global
        if (onImportNewEntities) {
          onImportNewEntities(entities);
        }
        
        // Pour compatibilité avec l'ancien système, on extrait les champs du premier agrégat
        const rootEntity = entities.find(e => e.aggregate_root) || entities[0];
        if (rootEntity && onImportFields) {
          const legacyFields: Field[] = rootEntity.fields.map(f => ({
            name: f.name,
            type: f.type,
            constraints: f.constraints || []
          }));
          onImportFields(legacyFields);
        }
      }
      
      setDebounceTimer(null);
    }, 800);

    setDebounceTimer(timeoutId);
  };



  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Structure JSON des entités</Label>
      </div>
      
      <Textarea
        placeholder={`Collez votre structure JSON :
[
  {
    "class": "Entreprise",
    "aggregate_root": true,
    "fields": [
      { "name": "id", "type": "UUID" },
      { "name": "siren", "type": "String" },
      { "name": "rna", "type": "String" },
      { "name": "siretSiegeSocial", "type": "String" },
      { "name": "categorieEntreprise", "type": "String" },
      { "name": "statusDiffusion", "type": "String" },
      { "name": "economieSocialeEtSolidaire", "type": "Boolean" },
      { "name": "dateCreation", "type": "LocalDate" },
      { "name": "dateCessation", "type": "LocalDate" }
    ],
    "relations": [
      {
        "name": "etablissements",
        "target": "Etablissement",
        "relation": "one-to-many",
        "collection_type": "List",
        "materialize": "embed"
      },
      {
        "name": "categorieJuridique",
        "target": "CategorieJuridique",
        "relation": "one-to-one",
        "materialize": "embed"
      },
      {
        "name": "formeJuridique",
        "target": "FormeJuridique",
        "relation": "one-to-one",
        "materialize": "embed"
      },
      {
        "name": "activitePrincipale",
        "target": "ActivitePrincipale",
        "relation": "one-to-one",
        "materialize": "embed"
      }
    ]
  },
  {
    "class": "Etablissement",
    "fields": [
      { "name": "id", "type": "UUID" },
      { "name": "siret", "type": "String" },
      { "name": "siegeSocial", "type": "Boolean" },
      { "name": "etatAdministratif", "type": "String" },
      { "name": "dateCreation", "type": "LocalDate" },
      { "name": "dateFermeture", "type": "LocalDate" }
    ],
    "relations": [
      {
        "name": "activitePrincipale",
        "target": "ActivitePrincipale",
        "relation": "one-to-one",
        "materialize": "embed"
      },
      {
        "name": "adresses",
        "target": "AdressePostale",
        "relation": "one-to-many",
        "collection_type": "List",
        "materialize": "embed"
      }
    ]
  },
  {
    "class": "AdressePostale",
    "fields": [
      { "name": "id", "type": "UUID" },
      { "name": "codePostal", "type": "String" },
      { "name": "libelleCommune", "type": "String" }
    ]
  },
  {
    "class": "CategorieJuridique",
    "fields": [
      { "name": "code", "type": "String" },
      { "name": "libelle", "type": "String" }
    ]
  },
  {
    "class": "FormeJuridique",
    "fields": [
      { "name": "code", "type": "String" },
      { "name": "libelle", "type": "String" }
    ]
  },
  {
    "class": "ActivitePrincipale",
    "fields": [
      { "name": "code", "type": "String" },
      { "name": "libelle", "type": "String" }
    ]
  }
]`}
        value={entitiesJson}
        onChange={(e) => handleJsonChange(e.target.value)}
        className="min-h-[300px] font-mono text-sm"
      />
      
      {/* Affichage des entités parsées */}
      {parsedEntities && parsedEntities.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="space-y-3">
            <div className="text-sm font-medium text-green-700">✓ {parsedEntities.length} entité(s) validée(s)</div>
            {parsedEntities.map((entity, index) => (
              <div key={index} className={`p-3 rounded text-sm ${
                entity.aggregate_root 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{entity.class}</span>
                    {entity.aggregate_root ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📍 Agrégat Racine</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">🔗 Entité</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Champs */}
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">📄 Champs ({entity.fields.length})</div>
                    <div className="space-y-1">
                      {entity.fields.slice(0, 3).map((field, fieldIndex) => (
                        <div key={fieldIndex} className="text-xs text-gray-700">
                          <span className="font-medium">{field.name}</span>
                          <span className="text-gray-500 ml-1">({field.type})</span>
                        </div>
                      ))}
                      {entity.fields.length > 3 && (
                        <div className="text-xs text-gray-500">... et {entity.fields.length - 3} autre(s)</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Relations */}
                  {entity.relations && entity.relations.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">🔗 Relations ({entity.relations.length})</div>
                      <div className="space-y-1">
                        {entity.relations.slice(0, 2).map((relation, relIndex) => (
                          <div key={relIndex} className="text-xs text-gray-700">
                            <span className="font-medium">{relation.name}</span>
                            <span className="text-gray-500 ml-1">→ {relation.target} ({relation.relation})</span>
                          </div>
                        ))}
                        {entity.relations.length > 2 && (
                          <div className="text-xs text-gray-500">... et {entity.relations.length - 2} autre(s)</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
    </div>
  );
};