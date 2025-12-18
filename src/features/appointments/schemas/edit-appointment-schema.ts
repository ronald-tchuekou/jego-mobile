import { z } from 'zod'

export const editAppointmentSchema = z.object({
  companyId: z.string().min(1, "L'identifiant de l'entreprise est requis"),
  date: z
    .string()
    .min(1, 'La date est requise')
    // Basic YYYY-MM-DD guard (loose; server will validate strictly)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu: YYYY-MM-DD'),
  time: z
    .string()
    .min(1, "L'heure est requise")
    // Basic HH:mm guard (24h)
    .regex(/^\d{2}:\d{2}$/, 'Format attendu: HH:mm'),
  content: z.string().min(1, 'Le contenu est requis'),
  subject: z.string().min(1, 'Le sujet est requis'),
})

export type EditAppointmentSchema = z.infer<typeof editAppointmentSchema>

export const defaultEditAppointmentValue: EditAppointmentSchema = {
  companyId: '',
  date: '',
  time: '',
  content: '',
  subject: '',
}
