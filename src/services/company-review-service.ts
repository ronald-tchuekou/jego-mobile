import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";
import { UserModel } from "./auth-service";
import { CompanyModel } from "./company-service";

export type CompanyReviewModel = {
  id: string;
  companyId: string;
  userId: string;
  comment: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  company: CompanyModel;
  user: UserModel;
};

const CompanyReviewService = {
  async getCompanyReviews(companyId: string, filter?: FilterQuery) {
    const { data } = await fetchHelper<PaginateResponse<CompanyReviewModel>>(
      `/company-reviews/company/${companyId}?${objectToQueryString(filter || {})}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  },
  async getById(id: string) {
    const { data, error } = await fetchHelper<{ data: CompanyReviewModel }>(
      `/company-reviews/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
  async create(body: CompanyReviewModel, token: string) {
    const { data, error } = await fetchHelper<{ data: CompanyReviewModel }>(
      "/company-reviews",
      {
        method: "POST",
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
  async update(id: string, body: CompanyReviewModel, token: string) {
    const { data, error } = await fetchHelper<{ data: CompanyReviewModel }>(
      `/company-reviews/${id}`,
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
    const { data, error } = await fetchHelper<{ data: CompanyReviewModel }>(
      `/company-reviews/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
  async getCompanyStats(companyId: string) {
    const { data, error } = await fetchHelper<{
      data: { averageRating: number; totalReviews: number };
    }>(`/company-reviews/${companyId}/stats`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (error) throw new Error(error);
    return data?.data ?? null;
  },
};

export default CompanyReviewService;
