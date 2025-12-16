import { z } from "zod";
import { emailSchema } from "./emailSchema";

export const updateEmailSchema = z
    .object({
        email: emailSchema,
    })

export type UpdateEmailData = z.infer<typeof updateEmailSchema>;