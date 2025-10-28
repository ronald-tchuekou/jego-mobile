function generateKeys(name: string) {
  const key = {
    all: [name] as const,
    lists: () => [...key.all, "list"] as const,
    list: (filters: string | Record<string, any>) =>
      [
        ...key.lists(),
        {
          filters:
            typeof filters === "string" ? filters : JSON.stringify(filters),
        },
      ] as const,
    details: () => [...key.all, "detail"] as const,
    detail: (id: string) => [...key.details(), id] as const,
  };

  return key;
}

export const postKey = generateKeys("posts");
export const chatKey = generateKeys("chat");
export const categoryKey = generateKeys("categories");
export const companyKey = generateKeys("companies");
export const companyReviewKey = generateKeys("company-reviews");
export const companyImageKey = generateKeys("company-images");
export const companyDocKey = generateKeys("company-docs");
export const companyServiceKey = generateKeys("company-services");
export const appointmentKey = generateKeys("appointments");
export const jobKey = generateKeys("jobs");
export const applicationKey = generateKeys("applications");
export const appointKey = generateKeys("appointments");
export const notificationKey = generateKeys("notifications");
export const userCVKey = generateKeys("user-cvs");
export const followingKey = generateKeys("following");
export const postLikeKey = generateKeys("post-likes");
export const postCommentKey = generateKeys("post-comments");
export const postCommentResponseKey = generateKeys("post-comment-responses");
