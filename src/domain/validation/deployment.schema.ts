import { z } from 'zod';

export const dockerSchema = z.object({
  appPort: z.number().int().min(1000).max(65535, 'Port invalide (1000-65535)'),
  enableDebug: z.boolean(),
  debugPort: z.number().int().min(1000).max(65535, 'Port de debug invalide (1000-65535)'),
  imageName: z.string().min(1, 'Le nom de l\'image est requis'),
  jarPattern: z.string().min(1, 'Le pattern JAR est requis')
});