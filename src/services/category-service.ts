import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";

export type CategoryModel = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryDto = {
  name: string;
  description: string | null;
  slug: string;
};

const CategoryService = {
  async createOne(body: CreateCategoryDto, token: string) {
    const { data, error } = await fetchHelper<{ data: CategoryModel }>(
      "/categories",
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
    if (!data?.data)
      throw new Error(
        "Une erreur est survenue lors de la création de la catégorie.",
      );
    return data.data;
  },

  async updateOne(id: string, body: Partial<CreateCategoryDto>, token: string) {
    const { data, error } = await fetchHelper<{ data: CategoryModel }>(
      `/categories/${id}`,
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
    if (!data?.data)
      throw new Error(
        "Une erreur est survenue lors de la mise à jour de la catégorie.",
      );
    return data.data;
  },

  async getAll(filter: FilterQuery) {
    const query = objectToQueryString(filter);

    const { data, error } = await fetchHelper<PaginateResponse<CategoryModel>>(
      `/categories?${query}`,
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
    const { data, error } = await fetchHelper<{ data: CategoryModel }>(
      `/categories/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data || null;
  },

  async deleteOne(id: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(
      `/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data;
  },
};

export default CategoryService;
