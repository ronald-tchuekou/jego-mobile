import { fetchHelper } from "../lib/fetch-helper";
import { UserModel } from "./auth-service";
import { PostModel } from "./post-service";

export type PostCommentResponseModel = {
  id: string;
  postCommentId: string;
  userId: string;
  comment: string;
  user: UserModel;
  post: PostModel;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostCommentResponseDto = {
  postCommentId: string;
  comment: string;
};

const PostCommentResponseService = {
  async getPostCommentResponses(options: {
    postCommentId: string;
    token: string;
    page?: number;
    limit?: number;
  }) {
    const { data, error } = await fetchHelper<{
      data: PaginateResponse<PostCommentResponseModel>;
    }>(
      `/post-comment-responses/${options.postCommentId}?page=${options.page || 1}&limit=${options.limit || 10}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  async createOne(body: CreatePostCommentResponseDto, token: string) {
    const { data, error } = await fetchHelper<{
      data: PostCommentResponseModel;
    }>(`/post-comment-responses/${body.postCommentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (error) throw new Error(error);
    if (!data?.data)
      throw new Error(
        "Une erreur est survenue lors de la création de la réponse au commentaire.",
      );
    return data.data;
  },

  async deleteOne(id: string, token: string) {
    const { data, error } = await fetchHelper<{ message: string }>(
      `/post-comment-responses/${id}`,
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

  async editOne(param: { id: string; comment: string }, token: string) {
    const { data, error } = await fetchHelper<{
      data: PostCommentResponseModel;
    }>(`/post-comment-responses/${param.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(param),
    });
    if (error) throw new Error(error);
    if (!data?.data)
      throw new Error(
        "Une erreur est survenue lors de la modification de la réponse au commentaire.",
      );
    return data.data;
  },
};

export default PostCommentResponseService;
