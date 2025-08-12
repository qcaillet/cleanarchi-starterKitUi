import { z } from 'zod';


export const modulesSchema = z.object({
  coverage: z.boolean(),
  postgresProvider: z.boolean(),
  externalApiProvider: z.boolean(),
  externalApiName: z.string().optional()
});