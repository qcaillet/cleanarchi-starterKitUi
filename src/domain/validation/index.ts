import { z } from 'zod';
import { generalConfigSchema } from './general.schema';
import { modulesSchema } from './modules.schema';
import { domainSchema } from './domain.schema';
import { dockerSchema } from './deployment.schema';

export * from './general.schema';
export * from './modules.schema';
export * from './domain.schema';
export * from './deployment.schema';

export const startkitConfigSchema = generalConfigSchema.extend({
  modules: modulesSchema,
  domain: domainSchema,
  docker: dockerSchema
});

export type StartkitConfigSchema = z.infer<typeof startkitConfigSchema>;