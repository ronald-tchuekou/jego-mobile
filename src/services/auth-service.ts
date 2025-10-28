import { fetchHelper } from "@/src/lib/fetch-helper";
import { CompanyModel } from "./company-service";
import { PostModel } from "./post-service";

export type UserRole = "admin" | "user" | "company:admin" | "company:agent";

export type UserModel = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  email: string;
  password: string;
  role: UserRole;
  companyId: string | null;
  profileImage: string | null;
  verifiedAt: string | null;
  lastLoginAt: string | null;
  blockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company?: CompanyModel;
  posts?: PostModel[];
};

export type Auth = {
  user: UserModel;
  token: string;
};

export type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ResetPasswordBody = {
  token: string;
  userId: string;
  password: string;
  confirmPassword: string;
};

const AuthService = {
  async login({ email, password }: { email: string; password: string }) {
    const { data, error } = await fetchHelper<Auth>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (error) throw new Error(error);
    return data!;
  },

  async logout(token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(
      "/auth/logout",
      { method: "POST", headers: { Authorization: `Bearer ${token}` } },
    );
    if (error) throw new Error(error);
    return data!;
  },

  async register(body: RegisterBody) {
    const { data, error } = await fetchHelper<Auth>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (error) throw new Error(error);
    return data!;
  },

  async verifyEmail(token: string, userId: string) {
    const { data, error } = await fetchHelper<Auth>("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId }),
    });
    if (error) throw new Error(error);
    return data!;
  },

  async forgotPassword(email: string) {
    const { data, error } = await fetchHelper<{ message: string }>(
      "/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    if (error) throw new Error(error);
    return data!;
  },

  async resetPassword(body: ResetPasswordBody) {
    const { data, error } = await fetchHelper<Auth>("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (error) throw new Error(error);
    return data!;
  },
};

export default AuthService;
