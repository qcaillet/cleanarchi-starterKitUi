import { z } from 'zod';

export const dockerSchema = z.object({
  baseImage: z.string().min(1, 'L\'image de base est requise'),
  portMapping: z.string().regex(/^\d+:\d+$/, 'Format de port invalide (ex: 8080:8080)'),
  startCommand: z.string().min(1, 'La commande de démarrage est requise')
});