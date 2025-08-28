import type { StartkitConfig } from '@/domain/config';

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

interface ProjectGenerationRequest {
  projectName: string;
  projectVersion: string;
  projectGroupId: string;
  projectArtifactId: string;
  javaVersion: string;
  description: string;
  mainEntityName: string;
  microserviceName: string;
  exposedPort: number;
  hasPostgres: boolean;
  hasRestService: boolean;
  restServiceName?: string;
  agregats: AgregatRequest[];
  dockerConfig: DockerConfigRequest;
}

interface DockerConfigRequest {
  appPort: number;
  enableDebug: boolean;
  debugPort: number;
  imageName: string;
  jarPattern: string;
}

interface AgregatRequest {
  agregatName: string;
  fields: FieldRequest[];
  useCases: string[];
  relations?: {
    name: string;
    target: string;
    relation: string;
    collection_type?: string;
    materialize: string;
  }[];
  subAggregates?: SubAggregateRequest[];
}

interface SubAggregateRequest {
  agregatName: string;
  fields: FieldRequest[];
  relations?: {
    name: string;
    target: string;
    relation: string;
    collection_type?: string;
    materialize: string;
  }[];
}

interface FieldRequest {
  fieldName: string;
  fieldType: string;
  constraints: string[];
}

/**
 * Transforme les use cases français en constantes anglaises supportées
 * Use cases supportés: SAVE, UPDATE, DELETE, READ
 */
const transformUseCases = (useCases: string[]): string[] => {
  const mapping: { [key: string]: string } = {
    'Sauvegarder': 'SAVE',
    'Modifier': 'UPDATE',
    'Supprimer': 'DELETE',
    'Lire': 'READ',
  };

  return useCases
    .map(useCase => mapping[useCase] || null)
    .filter((useCase): useCase is string => useCase !== null);
};

/**
 * Service pour la génération et le téléchargement de projets
 */
export class ProjectGeneratorService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:9013') {
    this.baseUrl = baseUrl;
  }

  /**
   * Transforme la config frontend en requête API Java
   */
  private transformConfigToApiRequest(config: StartkitConfig): ProjectGenerationRequest {
    const mainEntityName = config.microserviceName;
    
    const projectName = config.microserviceName || 'microservice-project';
    const projectVersion = config.version || '1.0-SNAPSHOT';
    const projectGroupId = config.groupId || 'com.example';
    const projectArtifactId = config.artifactId || config.microserviceName || 'microservice';
    const javaVersion = config.javaVersion?.toString() || '17';
    const description = config.description;
    
    const hasPostgres = config.modules.postgresProvider || false;
    const hasRestService = config.modules.externalApiProvider || false;
    const restServiceName = config.modules.externalApiName || undefined;

    const agregats: AgregatRequest[] = config.domain.aggregates.map(aggregate => ({
      agregatName: aggregate.name,
      fields: aggregate.fields.map(field => ({
        fieldName: field.name,
        fieldType: field.type,
        constraints: field.constraints
      })),
      useCases: transformUseCases(aggregate.useCases)
    }));

    const dockerConfig: DockerConfigRequest = {
      appPort: config.docker?.appPort || config.serverPort || 8080,
      enableDebug: config.docker?.enableDebug || false,
      debugPort: config.docker?.debugPort || 5005,
      imageName: config.docker?.imageName || `${config.microserviceName}:java${javaVersion}`,
      jarPattern: config.docker?.jarPattern || 'target/*.jar'
    };

    return {
      projectName,
      projectVersion,
      projectGroupId,
      projectArtifactId,
      javaVersion,
      description,
      mainEntityName,
      microserviceName: config.microserviceName,
      exposedPort: config.serverPort,
      hasPostgres,
      hasRestService,
      restServiceName,
      agregats,
      dockerConfig
    };
  }

  /**
   * Génère et télécharge le projet
   */
  async generateAndDownloadProject(config: StartkitConfig): Promise<void> {
    try {
      const apiRequest = this.transformConfigToApiRequest(config);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${apiRequest.mainEntityName.toLowerCase()}.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      throw error;
    }
  }

  /**
   * Génère et télécharge le projet avec la nouvelle structure d'entités
   * Transforme en format entité principale + sous-entités
   */
  async generateProjectWithNewStructure(config: StartkitConfig, entities: NewEntityStructure[]): Promise<void> {
    try {
      
      const mainEntity = entities.find(e => e.aggregate_root);
      if (!mainEntity) {
        throw new Error('Aucune entité principale trouvée (aggregate_root: true)');
      }
      
      const subEntities = entities.filter(e => !e.aggregate_root);
      
      const apiRequest: ProjectGenerationRequest = {
        projectName: config.microserviceName || 'microservice-project',
        projectVersion: config.version || '1.0-SNAPSHOT',
        projectGroupId: config.groupId || 'com.example',
        projectArtifactId: config.artifactId || config.microserviceName || 'microservice',
        javaVersion: config.javaVersion?.toString() || '17',
        description: config.description || '',
        mainEntityName: mainEntity.class,
        microserviceName: config.microserviceName || '',
        exposedPort: config.serverPort || 8080,
        hasPostgres: config.modules?.postgresProvider || false,
        hasRestService: config.modules?.externalApiProvider || false,
        restServiceName: config.modules?.externalApiName || undefined,
        
        dockerConfig: {
          appPort: config.docker?.appPort || config.serverPort || 8080,
          enableDebug: config.docker?.enableDebug || false,
          debugPort: config.docker?.debugPort || 5005,
          imageName: config.docker?.imageName || `${config.microserviceName}:java${config.javaVersion || 17}`,
          jarPattern: config.docker?.jarPattern || 'target/*.jar'
        },
        
        agregats: [{
          agregatName: mainEntity.class,
          fields: mainEntity.fields.map(field => ({
            fieldName: field.name,
            fieldType: field.type,
            constraints: field.constraints || []
          })),
            useCases: config.domain?.aggregates?.[0]?.useCases ? 
            transformUseCases(config.domain.aggregates[0].useCases) : 
            ['SAVE', 'UPDATE', 'DELETE', 'READ'],
          relations: mainEntity.relations || [],
          subAggregates: subEntities.map(subEntity => ({
            agregatName: subEntity.class,
            fields: subEntity.fields.map(field => ({
              fieldName: field.name,
              fieldType: field.type,
              constraints: field.constraints || []
            })),
            relations: subEntity.relations || []
          }))
        }]
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${mainEntity.class.toLowerCase()}-project.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
      throw error;
    }
  }

  /**
   * Test de connexion à l'API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('API non disponible:', error);
      return false;
    }
  }
}

// Instance par défaut
export const projectGeneratorService = new ProjectGeneratorService();