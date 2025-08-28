export interface Field {
  name: string;
  type: string;
  constraints: string[];
}

export interface Aggregate {
  name: string;
  fields: Field[];
  useCases: string[];
}

export interface DomainConfig {
  aggregates: Aggregate[];
  entitiesJson: string;
}

export type JavaType = 'String' | 'UUID' | 'BigDecimal' | 'Integer' | 'Long' | 'Boolean' | 'Instant' | 'LocalDate' | 'LocalDateTime';