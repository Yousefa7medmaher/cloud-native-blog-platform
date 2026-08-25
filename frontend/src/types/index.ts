export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'user';
  isSuspended?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface PostAuthor {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description?: string;
  content: string;
  featuredImage?: string;
  images?: string[];
  video?: string;
  category: Category;
  tags: Tag[];
  author: PostAuthor;
  status: 'draft' | 'published';
  publishedAt?: string;
  readingTime: number;
  views: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: PostAuthor;
  post: string | { title: string; slug: string };
  parent?: string;
  replies?: Comment[];
  isModerated?: boolean;
  isHidden?: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'reply' | 'system';
  message: string;
  isRead: boolean;
  sender?: PostAuthor;
  post?: { title: string; slug: string };
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    pages?: number;
  };
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  pages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  latestUsers: User[];
  latestPosts: Post[];
}

export interface UserAnalytics {
  totalPosts: number;
  published: number;
  drafts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  recentPosts: Post[];
}

export interface PostFormData {
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  category: string;
  tags?: string[];
  tagNames?: string[];
  featuredImage?: string;
  images?: string[];
  video?: string;
  status: 'draft' | 'published';
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string;
}
