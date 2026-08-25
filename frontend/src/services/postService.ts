import { api } from './api';
import type {
  ApiResponse,
  PaginatedPosts,
  Post,
  PostFormData,
  UserAnalytics,
} from '../types';

export interface PostQuery {
  search?: string;
  category?: string;
  tags?: string;
  status?: string;
  author?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'popular' | 'views';
}

export const postApi = {
  list: (params?: PostQuery) =>
    api.get<ApiResponse<Post[]>>('/posts', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<{ post: Post }>>(`/posts/slug/${slug}`),

  getById: (id: string) =>
    api.get<ApiResponse<{ post: Post }>>(`/posts/${id}`),

  create: (data: PostFormData) =>
    api.post<ApiResponse<{ post: Post }>>('/posts', data),

  update: (id: string, data: Partial<PostFormData>) =>
    api.put<ApiResponse<{ post: Post }>>(`/posts/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse>(`/posts/${id}`),

  like: (id: string) =>
    api.post<ApiResponse<{ liked: boolean; likeCount: number }>>(`/posts/${id}/like`),

  analytics: () => api.get<ApiResponse<UserAnalytics>>('/posts/analytics/me'),
};

export const parsePostsResponse = (response: Awaited<ReturnType<typeof postApi.list>>): PaginatedPosts => ({
  posts: response.data.data || [],
  total: response.data.meta?.total || 0,
  page: response.data.meta?.page || 1,
  pages: response.data.meta?.pages || 1,
});
