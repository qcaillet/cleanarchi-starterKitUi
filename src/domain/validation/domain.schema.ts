import { z } from 'zod';

export const fieldSchema = z.object({
  name: z.string().min(1, 'Le nom du champ est requis'),
  type: z.enum(['String', 'UUID', 'BigDecimal', 'Integer', 'Long', 'Boolean', 'Instant', 'LocalDate', 'LocalDateTime']),
  constraints: z.array(z.string()).default([])
});

export const aggregateSchema = z.object({
  name: z.string().min(1, 'Le nom de l\'agrégat est requis'),
  fields: z.array(fieldSchema).min(1, 'Au moins un champ est requis'),
  useCases: z.array(z.string()).min(1, 'Au moins un cas d\'usage est requis')
});

export const domainSchema = z.object({
  aggregates: z.array(aggregateSchema).min(1, 'Au moins un agrégat est requis')
});