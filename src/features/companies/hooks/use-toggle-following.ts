import { followingKey } from "@/src/lib/query-kye";
import CompanyFollowingService, { CreateCompanyFollowingDto } from "@/src/services/campany-following-service";
import { useAuthStore } from "@/src/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Alert } from "react-native";

export default function useToggleFollowing(companyId: string) {
  const auth = useAuthStore(s => s.auth);

  const {
    isLoading,
    data: following = null,
    refetch,
  } = useQuery({
    queryKey: followingKey.detail(companyId),
    queryFn: async ({ queryKey }) => {
      const companyId = queryKey[2];
      const userId = auth?.user?.id;
      const token = auth?.token;

      if (!userId || !token) return null;

      return CompanyFollowingService.getUserFollowing(userId, companyId, token);
    },
  });

  const { isPending: isCreating, mutate: _createFollowing } = useMutation(
    {
      mutationFn: async (body: CreateCompanyFollowingDto) => {
        return CompanyFollowingService.createOne(body, auth?.token ?? '');
      },
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        Alert.alert(error.message);
        console.error('createFollowing error ==> ', error);
      },
    },
  );
  const { isPending: isDeleting, mutate: _deleteFollowing } = useMutation(
    {
      mutationFn: async (companyId: string) => {
        return CompanyFollowingService.deleteOne(companyId, auth?.token ?? '');
      },
      onSuccess() {
        refetch();
      },
      onError: (error) => {
        Alert.alert(error.message);
        console.error('deleteFollowing error ==> ', error);
      },
    },
  );

  const createFollowing = useCallback(() => {
    _createFollowing({ companyId });
  }, [companyId, _createFollowing]);

  const deleteFollowing = useCallback(() => {
    _deleteFollowing(companyId);
  }, [companyId, _deleteFollowing]);

  return {
    loadingFollowing: isLoading,
    following,
    isPending: isDeleting || isCreating,
    createFollowing,
    deleteFollowing,
  };
}
