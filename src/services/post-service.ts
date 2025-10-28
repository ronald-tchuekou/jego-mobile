import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";
import { UserModel } from "./auth-service";

export enum PostType {
  EVENT = "event",
  NEWS = "news",
}

export type MediaModel = {
  id: string;
  userId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl: string | null;
  alt: string | null;
  metadata: {
    width: number | null;
    height: number | null;
    duration: number | null;
    aspectRatio: string | null;
  } | null;
};

export type PostModel = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  type: PostType;
  category: string;
  mediaType: "image" | "video" | null;
  medias: MediaModel[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  user: UserModel;
};

const PostService = {
  async getAll(
    filter: FilterQuery & { status?: string; category?: string; type?: string },
  ) {
    const query = objectToQueryString(filter);
    const companyId = filter.companyId;
    const withCompanyId = companyId ? `/company/${companyId}` : "";

    const { data, error } = await fetchHelper<PaginateResponse<PostModel>>(
      `/posts${withCompanyId}?${query}`,
    );
    if (error) throw new Error(error);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await fetchHelper<{ data: PostModel }>(
      `/posts/${id}`,
    );
    if (error) throw new Error(error);
    return data?.data || null;
  },

  async update(id: string, body: Partial<PostModel>, token: string) {
    const { data, error } = await fetchHelper<{ post: PostModel }>(
      `/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );
    if (error) throw new Error(error);
    return data?.post;
  },
};

export default PostService;
