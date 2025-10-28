import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";
import { UserModel } from "./auth-service";
import { CategoryModel } from "./category-service";
import { CompanyAppointmentRequestModel } from "./company-appointment-request-service";
import { CompanyDocModel } from "./company-doc-service";
import { CompanyImageModel } from "./company-image-service";
import { CompanyReviewModel } from "./company-review-service";
import { CompanyServiceModel } from "./company-service-service";
import { PostModel } from "./post-service";

export type CompanyModel = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
  tiktok: string | null;
  logo: string | null;
  bannerImage: string | null;
  description: string | null;
  followingCount: number;
  verifiedAt: string | null;
  blockedAt: string | null;
  location: { lat: number; lng: number } | null;
  dailyProgram: Record<
    DAY_FOR_PROGRAM,
    { open?: string; close?: string }
  > | null;
  createdAt: string;
  updatedAt: string;
  posts: PostModel[];
  users: UserModel[];
  images: CompanyImageModel[];
  docs: CompanyDocModel[];
  services: CompanyServiceModel[];
  reviews: CompanyReviewModel[];
  appointmentRequests: CompanyAppointmentRequestModel[];
  category: CategoryModel | null;
};

const CompanyService = {
  async count(token: string, search: string = "") {
    const { data, error } = await fetchHelper<{ count: number }>(
      `/companies/count?search=${search}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data?.count;
  },
  async getAll(
    filter: FilterQuery & {
      categoryId?: string;
      status?: "active" | "blocked";
    },
  ) {
    const query = objectToQueryString(filter);

    const { data, error } = await fetchHelper<PaginateResponse<CompanyModel>>(
      `/companies?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (error) throw new Error(error);
    return data;
  },
  async getById(id: string) {
    const { data, error } = await fetchHelper<{ data: CompanyModel }>(
      `/companies/${id}?include=users`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
  async create(body: Partial<CompanyModel>) {
    const { data, error } = await fetchHelper<{ data: CompanyModel }>(
      "/companies",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
  async update(id: string, body: Partial<CompanyModel>, token: string) {
    const { data, error } = await fetchHelper<{ data: CompanyModel }>(
      `/companies/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
  async delete(id: string, token: string) {
    const { data, error } = await fetchHelper<CompanyModel>(
      `/companies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data ?? null;
  },
  async toggleBlock(id: string, token: string) {
    const { data, error } = await fetchHelper<CompanyModel>(
      `/companies/${id}/toggle-block`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data ?? null;
  },
  async toggleApprove(id: string, token: string) {
    const { data, error } = await fetchHelper<CompanyModel>(
      `/companies/${id}/toggle-approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data ?? null;
  },

  async chartData(
    token: string,
    range?: { startDate: string; endDate: string },
  ) {
    let query = "";
    if (range) {
      query = objectToQueryString(range);
    }
    const { data, error } = await fetchHelper<{
      data: { date: string; count: number }[];
      startDate: string;
      endDate: string;
    }>(`/companies/count-per-day?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data;
  },
};

export default CompanyService;
