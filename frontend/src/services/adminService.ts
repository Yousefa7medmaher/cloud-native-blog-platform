import { api } from './api';
import type { ApiResponse, Comment, DashboardStats, Post, User } from '../types';

export const adminApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/admin/stats'),

  listUsers: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<User[]>>('/admin/users', { params }),

  deleteUser: (id: string) => api.delete<ApiResponse>(`/admin/users/${id}`),

  suspendUser: (id: string, isSuspended: boolean) =>
    api.patch<ApiResponse<{ user: User }>>(`/admin/users/${id}/suspend`, { isSuspended }),

  promoteUser: (id: string, role: 'admin' | 'user') =>
    api.patch<ApiResponse<{ user: User }>>(`/admin/users/${id}/role`, { role }),

  listPosts: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Post[]>>('/admin/posts', { params }),

  updatePost: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<{ post: Post }>>(`/admin/posts/${id}`, data),

  deletePost: (id: string) => api.delete<ApiResponse>(`/admin/posts/${id}`),

  listComments: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Comment[]>>('/admin/comments', { params }),

  moderateComment: (id: string, data: { isHidden?: boolean; isModerated?: boolean }) =>
    api.patch<ApiResponse<{ comment: Comment }>>(`/admin/comments/${id}`, data),

  deleteComment: (id: string) => api.delete<ApiResponse>(`/admin/comments/${id}`),
};

export const userApi = {
  getByUsername: (username: string) =>
    api.get<ApiResponse<{ user: User }>>(`/users/${username}`),
};
