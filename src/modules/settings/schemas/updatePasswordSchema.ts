
import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

// Cambiar contraseña (logueado): oldPassword + password + confirmPassword
export const updatePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
   message: "La nueva contraseña no puede ser igual a la anterior",
   path: ["password"],
  });

export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
