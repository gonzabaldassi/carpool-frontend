import { z } from "zod";

export const profileSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
  phone: z.string().min(8, 'Número demasiado corto').max(15, 'Número demasiado largo'),
  removeProfileImage: z.boolean(),
  file: z.instanceof(File).optional(), // archivo opcional
});

export type ProfileData = z.infer<typeof profileSchema>;