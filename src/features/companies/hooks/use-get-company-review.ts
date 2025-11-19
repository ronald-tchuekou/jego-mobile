import { companyReviewKey } from "@/src/lib/query-kye";
import CompanyReviewService from "@/src/services/company-review-service";
import { useCompanyReviewsStore } from "@/src/stores/company-reviews-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const useGetCompanyReview = ({ companyId }: { companyId: string }) => {
  const { setReviews, setLoadingState } = useCompanyReviewsStore(
    useShallow((state) => ({
      setReviews: state.setReviews,
      setLoadingState: state.setLoadingState,
    })),
  );

  const { data, isLoading } = useQuery({
    queryKey: companyReviewKey.list({ companyId }),
    async queryFn({ queryKey }) {
      const { companyId } = JSON.parse(queryKey[2].filters);
      return CompanyReviewService.getCompanyReviews(companyId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setReviews(
      data?.data || [],
      data?.meta.currentPage || 1,
      data?.meta.lastPage || 1,
    );
  }, [data, setReviews]);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading, setLoadingState]);
};

export default useGetCompanyReview;
