import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    email: z.email("Veuillez entrer une adresse e-mail valide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const defaultRegisterValue: RegisterSchema = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};
