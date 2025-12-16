// schemas/registerSchema.ts
import { passwordSchema } from '@/modules/settings/schemas/passwordSchema';
import { z } from 'zod'


// Esquema base para el paso 1 (sin refine)
const registerStep1BaseSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(25, 'El nombre de usuario no puede tener más de 25 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es obligatorio')
    .max(75, 'El email de usuario no puede tener más de 75 caracteres'),
  
  // Reutilizamos el schema para las contraseñas creado en otro schema
  password: passwordSchema,
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
})

// Esquema para el paso 1 con validación de contraseñas
export const registerStep1Schema = registerStep1BaseSchema.refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
)

// Esquema para el paso 2 (datos personales)
export const registerStep2Schema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  lastname: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  
  dni: z
    .string()
    .min(7, 'El DNI debe tener al menos 7 dígitos')
    .max(50, 'El DNI no puede tener más de 50 dígitos')
    .regex(/^\d+$/, 'El DNI solo puede contener números'),
    
  birthDate: z
    .string()
    .refine((date) => {
      const parsed = Date.parse(date);
      if (isNaN(parsed)) return false;
      const birth = new Date(parsed);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
    }, {
      message: 'Debes ser mayor de 18 años',
    }),
  
  phone: z
    .string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(25, 'El teléfono no puede tener más de 25 dígitos')
    .regex(/^[0-9+\-\s()]+$/, 'El número de teléfono debe contener únicamente números, guiones, signos + y espacios.'),
  
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
})

// Esquema completo para el registro (usando el esquema base sin refine)
export const completeRegisterSchema = registerStep1BaseSchema
  .merge(registerStep2Schema)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

// Tipos TypeScript generados a partir de los esquemas
export type RegisterStep1Data = z.infer<typeof registerStep1Schema>
export type RegisterStep2Data = z.infer<typeof registerStep2Schema>
export type RegisterData = z.infer<typeof completeRegisterSchema>