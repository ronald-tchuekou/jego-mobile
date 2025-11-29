import { z } from 'zod'

export const deleteAccountSchema = z
  .object({
    password: z.string().min(1, 'Le mot de passe est requis pour supprimer votre compte'),
    confirmation: z.string().min(1, 'Veuillez taper "SUPPRIMER" pour confirmer'),
  })
  .refine((data) => data.confirmation === 'SUPPRIMER', {
    message: 'Veuillez taper exactement "SUPPRIMER" pour confirmer',
    path: ['confirmation'],
  })

export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>

export const defaultDeleteAccountValue: DeleteAccountSchema = {
  password: '',
  confirmation: '',
}


