import type { StartkitConfig } from '@/domain/config';

export const DEFAULT_CONFIG: StartkitConfig = {
  microserviceName: 'ms-commande',
  groupId: 'fr.assia',
  version: '0.1.0-SNAPSHOT',
  rootPackage: 'fr.assia.commande',
  artifactId: 'ms-commande',
  javaVersion: 17,
  diFramework: 'spring',
  description: 'Microservice de gestion des commandes',
  modules: {
    coverage: true,
    postgresProvider: false,
    externalApiProvider: false,
    externalApiName: ''
  },
  domain: {
    aggregates: [
      {
        name: 'adresse',
        fields: [
          { name: 'id', type: 'UUID', constraints: ['not null'] },
          { name: 'rue', type: 'BigDecimal', constraints: ['min:0'] },
          { name: 'complementAdresse', type: 'Instant', constraints: ['not null'] }
        ],
        useCases: ['Sauvegarder', 'Modifier', 'Supprimer', 'Lire']
      }
    ],
    entitiesJson: ''
  },
  springProfiles: ['dev', 'prod'],
  serverPort: 8080,
  docker: {
    appPort: 8080,
    enableDebug: false,
    debugPort: 5005,
    imageName: 'mon-app:java17',
    jarPattern: 'target/*.jar'
  }
};