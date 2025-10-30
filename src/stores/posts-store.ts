import { create } from 'zustand'
import { PostModel } from '../services/post-service'

export type PostsState = {
  posts: PostModel[]
  page: number
  totalPage: number
  isLoading: boolean
  setPosts: (posts: PostModel[], page: number, totalPage: number) => void
  addNewPosts: (posts: PostModel[], page: number, totalPage: number) => void
  setLoadingState: (isLoading: boolean) => void
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  page: 1,
  totalPage: 1,
  isLoading: false,
  setPosts(posts, page, totalPage) {
    set((state) => ({ ...state, posts, page, totalPage }))
  },
  addNewPosts(posts, page, totalPage) {
    set((state) => ({
      ...state,
      posts: [...state.posts, ...posts],
      page,
      totalPage,
    }))
  },
  setLoadingState: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }))
  },
}))
