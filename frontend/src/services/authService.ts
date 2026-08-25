import { api } from './api';
import type { ApiResponse, RegisterData, User } from '../types';

export const authApi = {
  register: (data: RegisterData) =>
    api.post<ApiResponse<{ user: User }>>('/auth/register', data),

  login: (email: string, password: string, rememberMe = false) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', {
      email,
      password,
      rememberMe,
    }),

  logout: () => api.post<ApiResponse>('/auth/logout'),

  getProfile: () => api.get<ApiResponse<{ user: User }>>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse>('/auth/password', { currentPassword, newPassword }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<{ user: User }>>('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
