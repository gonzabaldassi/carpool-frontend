import { z } from "zod";

// Regla reutilizable para una contraseña
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(255, "La contraseña no puede tener más de 255 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
  );