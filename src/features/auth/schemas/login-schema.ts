import { z } from 'zod'

export const loginSchema = z.object({
	email: z.email('Veuillez entrer une adresse e-mail valide'),
	password: z
		.string()
		.min(1, 'Le mot de passe est requis')
		.min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const defaultLoginFormValue: LoginSchema = {
	email: '',
	password: '',
}
