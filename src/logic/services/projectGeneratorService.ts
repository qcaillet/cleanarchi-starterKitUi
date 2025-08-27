import type { StartkitConfig } from '@/domain/config';

// Nouvelle structure d'entité
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

// Types correspondant à l'API Java
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
 * Use cases supportés: SAVE, UPDATE, DELETE
 */
const transformUseCases = (useCases: string[]): string[] => {
  const mapping: { [key: string]: string } = {
    'Sauvegarder': 'SAVE',
    'Créer': 'SAVE',
    'Modifier': 'UPDATE',
    'Mettre à jour': 'UPDATE',
    'Supprimer': 'DELETE'
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
    // Utilise le nom du microservice comme entité principale
    const mainEntityName = config.microserviceName;
    
    // Configuration Maven/Gradle
    const projectName = config.microserviceName || 'microservice-project';
    const projectVersion = config.version || '1.0-SNAPSHOT';
    const projectGroupId = config.groupId || 'com.example';
    const projectArtifactId = config.artifactId || config.microserviceName || 'microservice';
    const javaVersion = config.javaVersion?.toString() || '17';
    const description = config.description;
    
    // Mapping des providers
    const hasPostgres = config.modules.postgresProvider || false;
    const hasRestService = config.modules.externalApiProvider || false;
    const restServiceName = config.modules.externalApiName || undefined;

    // Transformation des agrégats
    const agregats: AgregatRequest[] = config.domain.aggregates.map(aggregate => ({
      agregatName: aggregate.name,
      fields: aggregate.fields.map(field => ({
        fieldName: field.name,
        fieldType: field.type,
        constraints: field.constraints
      })),
      useCases: transformUseCases(aggregate.useCases)
    }));

    // Configuration Docker avec valeurs par défaut
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
      console.log('🚀 Génération du projet...', config);
      
      // Transform config to API request
      const apiRequest = this.transformConfigToApiRequest(config);
      console.log('📋 Requête API:', apiRequest);

      // Call the API
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

      // Get the blob (ZIP file)
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
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
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Projet téléchargé avec succès!');
      
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
      console.log('🚀 Génération du projet avec nouvelle structure...', entities);
      
      // Trouve l'entité principale (aggregate_root: true)
      const mainEntity = entities.find(e => e.aggregate_root);
      if (!mainEntity) {
        throw new Error('Aucune entité principale trouvée (aggregate_root: true)');
      }
      
      // Les autres entités deviennent des sous-entités
      const subEntities = entities.filter(e => !e.aggregate_root);
      
      // Transforme en format attendu par le backend
      const apiRequest: ProjectGenerationRequest = {
        // Informations de base du projet
        projectName: config.microserviceName || 'microservice-project',
        projectVersion: config.version || '1.0-SNAPSHOT',
        projectGroupId: config.groupId || 'com.example',
        projectArtifactId: config.artifactId || config.microserviceName || 'microservice',
        javaVersion: config.javaVersion?.toString() || '17',
        description: config.description || '',
        mainEntityName: mainEntity.class,
        microserviceName: config.microserviceName || '',
        exposedPort: config.serverPort || 8080,
        
        // Modules
        hasPostgres: config.modules?.postgresProvider || false,
        hasRestService: config.modules?.externalApiProvider || false,
        restServiceName: config.modules?.externalApiName || undefined,
        
        // Configuration Docker
        dockerConfig: {
          appPort: config.docker?.appPort || config.serverPort || 8080,
          enableDebug: config.docker?.enableDebug || false,
          debugPort: config.docker?.debugPort || 5005,
          imageName: config.docker?.imageName || `${config.microserviceName}:java${config.javaVersion || 17}`,
          jarPattern: config.docker?.jarPattern || 'target/*.jar'
        },
        
        // Agrégat principal avec sous-agrégats
        agregats: [{
          agregatName: mainEntity.class,
          fields: mainEntity.fields.map(field => ({
            fieldName: field.name,
            fieldType: field.type,
            constraints: field.constraints || []
          })),
          useCases: ['SAVE', 'UPDATE', 'DELETE'], // Cas d'usage par défaut
          // Relations de l'entité principale
          relations: mainEntity.relations || [],
          // Sous-agrégats - Le backend générera un fichier par sous-agrégat
          subAggregates: subEntities.map(subEntity => ({
            agregatName: subEntity.class,
            fields: subEntity.fields.map(field => ({
              fieldName: field.name,
              fieldType: field.type,
              constraints: field.constraints || []
            })),
            // Relations du sous-agrégat
            relations: subEntity.relations || []
          }))
        }]
      };
      
      console.log('📋 Structure envoyée au backend:');
      console.log(`🎯 Entité principale: ${mainEntity.class}`);
      console.log(`📁 Sous-entités (${subEntities.length}):`, subEntities.map(s => s.class));
      console.log('📋 Requête complète:', JSON.stringify(apiRequest, null, 2));

      // Appel de l'API
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

      // Téléchargement du ZIP
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
      
      console.log('✅ Projet téléchargé avec succès!');
      console.log(`📊 Le backend va générer des fichiers pour:`);
      console.log(`   - Entité principale: ${mainEntity.class}`);
      subEntities.forEach(sub => console.log(`   - Sous-entité: ${sub.class}`));
      
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