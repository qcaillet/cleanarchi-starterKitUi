import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server } from "lucide-react";

interface NewMicroservice {
  name: string;
  description: string;
  port: number;
  includeDatabase: boolean;
  databaseName: string;
  framework: string;
  javaVersion: string;
}

interface AddMicroserviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (microservice: NewMicroservice) => void;
}

export function AddMicroserviceDialog({ open, onOpenChange, onAdd }: AddMicroserviceDialogProps) {
  const [formData, setFormData] = useState<NewMicroservice>({
    name: '',
    description: '',
    port: 8080,
    includeDatabase: false,
    databaseName: '',
    framework: 'spring-boot',
    javaVersion: '17'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du microservice est requis';
    } else if (!/^[a-z-]+$/.test(formData.name)) {
      newErrors.name = 'Le nom doit contenir uniquement des lettres minuscules et des tirets';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.port < 1000 || formData.port > 65535) {
      newErrors.port = 'Le port doit être entre 1000 et 65535';
    }

    if (formData.includeDatabase && !formData.databaseName.trim()) {
      newErrors.databaseName = 'Le nom de la base de données est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(formData);
      setFormData({
        name: '',
        description: '',
        port: 8080,
        includeDatabase: false,
        databaseName: '',
        framework: 'spring-boot',
        javaVersion: '17'
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  const updateFormData = (field: keyof NewMicroservice, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate database name based on microservice name
    if (field === 'name' && formData.includeDatabase) {
      setFormData(prev => ({
        ...prev,
        databaseName: `db_${value.replace(/-/g, '_')}`
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Ajouter un nouveau microservice
          </DialogTitle>
          <DialogDescription>
            Configurez votre nouveau microservice avec les options de base de données
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration de base</CardTitle>
              <CardDescription>Informations principales du microservice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du microservice *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="ms-mon-service"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="port">Port *</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => updateFormData('port', parseInt(e.target.value) || 8080)}
                    placeholder="8080"
                    className={errors.port ? 'border-red-500' : ''}
                  />
                  {errors.port && <p className="text-red-500 text-sm mt-1">{errors.port}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Description du microservice"
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="framework">Framework</Label>
                  <Select value={formData.framework} onValueChange={(value) => updateFormData('framework', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring-boot">Spring Boot</SelectItem>
                      <SelectItem value="quarkus">Quarkus</SelectItem>
                      <SelectItem value="micronaut">Micronaut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="javaVersion">Version Java</Label>
                  <Select value={formData.javaVersion} onValueChange={(value) => updateFormData('javaVersion', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="17">Java 17</SelectItem>
                      <SelectItem value="21">Java 21</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration de la base de données */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-4 w-4" />
                Base de données PostgreSQL
              </CardTitle>
              <CardDescription>Optionnel : Incluez une base de données PostgreSQL dédiée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDatabase"
                  checked={formData.includeDatabase}
                  onCheckedChange={(checked) => updateFormData('includeDatabase', checked)}
                />
                <Label htmlFor="includeDatabase">
                  Inclure une base de données PostgreSQL
                </Label>
              </div>

              {formData.includeDatabase && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <div>
                    <Label htmlFor="databaseName">Nom de la base de données *</Label>
                    <Input
                      id="databaseName"
                      value={formData.databaseName}
                      onChange={(e) => updateFormData('databaseName', e.target.value)}
                      placeholder="db_mon_service"
                      className={errors.databaseName ? 'border-red-500' : ''}
                    />
                    {errors.databaseName && <p className="text-red-500 text-sm mt-1">{errors.databaseName}</p>}
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">Configuration automatique :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Container PostgreSQL 15</li>
                      <li>• Port : 5432 (mappé automatiquement)</li>
                      <li>• Username : postgres</li>
                      <li>• Password : généré automatiquement</li>
                      <li>• Volume persistant pour les données</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer le microservice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}