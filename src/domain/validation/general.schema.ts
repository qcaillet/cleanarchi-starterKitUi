import { z } from 'zod';

export const generalConfigSchema = z.object({
  microserviceName: z.string().min(1, 'Le nom du microservice est requis'),
  groupId: z.string().min(1, 'Le group ID est requis'),
  version: z.string().min(1, 'La version est requise'),
  artifactId: z.string().min(1, 'L\'artifact ID est requis'),
  javaVersion: z.number().refine((val) => [11, 17, 21].includes(val), {
    message: 'Version Java doit être 11, 17 ou 21'
  }),
  diFramework: z.string().default('spring'),
  springProfiles: z.array(z.string()).min(1, 'Au moins un profil Spring est requis'),
  serverPort: z.number().int().min(1000).max(65535, 'Port invalide'),
  description: z.string().min(1, 'La description est requise')
});