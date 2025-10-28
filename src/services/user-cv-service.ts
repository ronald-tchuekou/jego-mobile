import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";

export type UserCvModel = {
  id: string;
  userId: string;
  name: string;
  path: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserCvDto = {
  userId: string;
  name: string;
  path: string;
  type: string;
};

const UserCvService = {
  async createOne(body: CreateUserCvDto, token: string) {
    const { data, error } = await fetchHelper<{ data: UserCvModel }>(
      "/user-cvs",
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
      throw new Error("Une erreur est survenue lors de la création de la CV.");
    return data.data;
  },

  async updateOne(id: string, body: Partial<CreateUserCvDto>, token: string) {
    const { data, error } = await fetchHelper<{ data: UserCvModel }>(
      `/user-cvs/${id}`,
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
        "Une erreur est survenue lors de la mise à jour de la CV.",
      );
    return data.data;
  },

  async getAll(filter: FilterQuery, token: string) {
    const query = objectToQueryString(filter);

    const { data, error } = await fetchHelper<PaginateResponse<UserCvModel>>(
      `/user-cvs?${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (error) throw new Error(error);

    return data;
  },

  async getById(id: string, token: string) {
    const { data, error } = await fetchHelper<{ data: UserCvModel }>(
      `/user-cvs/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data?.data || null;
  },

  async deleteOne(id: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(
      `/user-cvs/${id}`,
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

export default UserCvService;
