import { z } from 'zod'

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
      .string()
      .min(1, 'Le nouveau mot de passe est requis')
      .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
    confirmNewPassword: z.string().min(1, 'La confirmation du nouveau mot de passe est requise'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ['newPassword'],
  })

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>

export const defaultUpdatePasswordValue: UpdatePasswordSchema = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}
