"use client";

import { postKey } from "@/src/lib/query-kye";
import PostService from "@/src/services/post-service";
import { usePostsStore } from "@/src/stores/posts-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function useGetPosts(search?: string) {
  const { setPosts, setLoadingState, addNewPosts } = usePostsStore(
    useShallow((state) => ({
      setPosts: state.setPosts,
      setLoadingState: state.setLoadingState,
      addNewPosts: state.addNewPosts,
    })),
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: postKey.list({
      search: search || undefined,
    }),
    async queryFn({ queryKey }) {
      const { search } = JSON.parse(queryKey[2].filters);
      const filters: FilterQuery = {};

      if (search) filters.search = search;

      return PostService.getAll(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate, isPending } = useMutation({
    async mutationFn({
      page,
      search,
    }: {
      page: number;
      search: string | undefined;
    }) {
      const response = await PostService.getAll({ page, search });
      addNewPosts(
        response?.data || [],
        response?.meta.currentPage || 1,
        response?.meta.lastPage || 1,
      );
    },
  });

  useEffect(() => {
    setPosts(
      data?.data || [],
      data?.meta.currentPage || 1,
      data?.meta.lastPage || 1,
    );
  }, [data, setPosts]);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading, setLoadingState]);

  return { mutate, isPending, refetch };
}
