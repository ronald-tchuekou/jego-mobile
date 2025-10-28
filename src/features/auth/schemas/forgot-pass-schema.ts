import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Veuillez entrer une adresse e-mail valide"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const defaultForgotPasswordValue: ForgotPasswordSchema = {
  email: "",
};
