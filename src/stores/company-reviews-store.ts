import { CompanyReviewModel } from '@/src/services/company-review-service'
import { create } from 'zustand'

export type CompanyReviewsState = {
  reviews: CompanyReviewModel[]
  page: number
  totalPage: number
  isLoading: boolean
  setReviews: (posts: CompanyReviewModel[], page: number, totalPage: number) => void
  addNewReviews: (posts: CompanyReviewModel[], page: number, totalPage: number) => void
  setLoadingState: (isLoading: boolean) => void
}

export const useCompanyReviewsStore = create<CompanyReviewsState>((set) => ({
  reviews: [],
  page: 1,
  totalPage: 1,
  isLoading: false,
  setReviews(reviews, page, totalPage) {
    set((state) => ({ ...state, reviews, page, totalPage }))
  },
  addNewReviews(reviews, page, totalPage) {
    set((state) => ({
      ...state,
      reviews: [...state.reviews, ...reviews],
      page,
      totalPage,
    }))
  },
  setLoadingState: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }))
  },
}))
