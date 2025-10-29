"use client";

import { postLikeKey } from "@/src/lib/query-kye";
import PostLikeService from "@/src/services/post-like-service";
import { useAuthStore } from "@/src/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

type Options = {
  onSuccess?: (state: boolean) => void;
};

export default function usePostLike(postId: string, options?: Options) {
  const auth = useAuthStore((state) => state.auth);

  const {
    isLoading,
    data: like = null,
    refetch,
  } = useQuery({
    queryKey: postLikeKey.detail(postId),
    async queryFn({ queryKey }) {
      const postId = queryKey[2];
      const userId = auth?.user?.id;
      const token = auth?.token;

      if (!userId || !token) return null;
      return PostLikeService.getUserLike(userId, postId, token);
    },
  });

  const { isPending: isCreating, mutate: _createLike } = useMutation(
    {
      mutationFn: async (postId: string) => {
        if(!auth?.token) throw new Error('Token not found');
        return PostLikeService.createOne({ postId }, auth.token);
      },
      onSuccess: () => {
        refetch();
      },
    },
  );

  const { isPending: isDeleting, mutate: _deleteLike } = useMutation({
    mutationFn: async (postId: string) => {
      if(!auth?.token) throw new Error('Token not found');
      return PostLikeService.deleteOne(postId, auth.token);
    },
		onSuccess() {
			refetch()
		},
  })

  const createLike = useCallback(() => {
    _createLike(postId);
  }, [postId, _createLike]);

  const deleteLike = useCallback(() => {
    _deleteLike(postId);
  }, [postId, _deleteLike]);

  useEffect(() => {
    options?.onSuccess?.(!!like);
  }, [like, options]);

  return {
    loadingLike: isLoading,
    isPending: isDeleting || isCreating,
    createLike,
    deleteLike,
  };
}
