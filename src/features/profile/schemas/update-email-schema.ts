import { z } from 'zod'

export const updateEmailSchema = z.object({
  email: z.email('Veuillez entrer une adresse e-mail valide'),
  password: z.string().min(1, "Le mot de passe actuel est requis pour changer l'email"),
})

export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>

export const defaultUpdateEmailValue: UpdateEmailSchema = {
  email: '',
  password: '',
}

export const verifyEmailChangeSchema = z.object({
  verificationCode: z.string().min(6, 'Le code de vérification doit contenir 6 caractères').max(6, 'Le code de vérification doit contenir 6 caractères'),
})

export type VerifyEmailChangeSchema = z.infer<typeof verifyEmailChangeSchema>

export const defaultVerifyEmailChangeValue: VerifyEmailChangeSchema = {
  verificationCode: '',
}


