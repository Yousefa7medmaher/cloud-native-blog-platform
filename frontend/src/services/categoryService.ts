import { api } from './api';
import type { ApiResponse, Category, Comment, Tag } from '../types';

export const categoryApi = {
  list: () => api.get<ApiResponse<{ categories: Category[] }>>('/categories'),
  create: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<{ category: Category }>>('/categories', data),
  listTags: () => api.get<ApiResponse<{ tags: Tag[] }>>('/categories/tags'),
};

export const commentApi = {
  create: (data: { content: string; post: string; parent?: string }) =>
    api.post<ApiResponse<{ comment: Comment }>>('/comments', data),

  listByPost: (postId: string, page = 1) =>
    api.get<ApiResponse<Comment[]>>(`/comments/post/${postId}`, { params: { page } }),

  update: (id: string, content: string) =>
    api.put<ApiResponse<{ comment: Comment }>>(`/comments/${id}`, { content }),

  delete: (id: string) => api.delete<ApiResponse>(`/comments/${id}`),
};

export const mediaApi = {
  upload: (file: File, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post<ApiResponse<{ url: string; key: string; type: string }>>(
      '/media/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  uploadMultiple: (files: File[], folder = 'uploads') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);
    return api.post<ApiResponse<{ files: { url: string }[] }>>(
      '/media/upload/multiple',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};
