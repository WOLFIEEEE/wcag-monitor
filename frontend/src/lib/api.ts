// API calls go to the same origin - Next.js rewrites proxy them to backend
const API_URL = '';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(error.error || error.message || 'Request failed', response.status);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// Auth API
export const auth = {
  signup: (data: { email: string; password: string; name?: string }) =>
    request<{ user: User; accessToken: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: data,
    }),
    
  login: (data: { email: string; password: string }) =>
    request<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: data,
    }),
    
  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    }),
    
  me: () => request<{ user: User }>('/auth/me'),
  
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot', {
      method: 'POST',
      body: { email },
    }),
    
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset', {
      method: 'POST',
      body: { token, password },
    }),
    
  updateProfile: (data: Partial<User>) =>
    request<{ user: User }>('/auth/profile', {
      method: 'PATCH',
      body: data,
    }),
    
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/password', {
      method: 'PATCH',
      body: { currentPassword, newPassword },
    }),
};

// Tasks API
export const tasks = {
  list: (lastres = false) =>
    request<Task[]>(`/tasks${lastres ? '?lastres=true' : ''}`),
    
  create: (data: CreateTaskData) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: data,
    }),
    
  get: (id: string, lastres = false) =>
    request<Task>(`/tasks/${id}${lastres ? '?lastres=true' : ''}`),
    
  update: (id: string, data: Partial<CreateTaskData>) =>
    request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: data,
    }),
    
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
    
  run: (id: string) =>
    request<Result>(`/tasks/${id}/run`, { method: 'POST' }),
    
  results: (id: string, full = false) =>
    request<Result[]>(`/tasks/${id}/results${full ? '?full=true' : ''}`),
    
  result: (taskId: string, resultId: string, full = false) =>
    request<Result>(`/tasks/${taskId}/results/${resultId}${full ? '?full=true' : ''}`),
    
  trend: (id: string) =>
    request<TrendData[]>(`/tasks/${id}/trend`),
    
  stats: () =>
    request<Stats>('/tasks/stats'),
    
  allResults: (full = false) =>
    request<Result[]>(`/tasks/results${full ? '?full=true' : ''}`),
};

// Billing API
export const billing = {
  checkout: (quantity: number) =>
    request<{ sessionId: string; url: string }>('/billing/checkout', {
      method: 'POST',
      body: { quantity },
    }),
    
  portal: () =>
    request<{ url: string }>('/billing/portal', { method: 'POST' }),
    
  usage: () =>
    request<UsageInfo>('/billing/usage'),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  paidUrlCount: number;
  emailVerified: boolean;
  notifications: {
    email: boolean;
    frequency: 'daily' | 'weekly';
    alertOnError: boolean;
  };
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  name: string;
  url: string;
  standard: string;
  timeout: number;
  wait: number;
  ignore: string[];
  actions: string[];
  pageLimit: number;
  lastRun: string | null;
  createdAt: string;
  updatedAt: string;
  last_result?: Result;
  // Advanced options
  username?: string;
  password?: string;
  headers?: Record<string, string>;
  hideElements?: string;
  annotations?: Array<{
    type: string;
    date: number;
    comment: string;
  }>;
}

export interface CreateTaskData {
  name: string;
  url: string;
  standard: 'Section508' | 'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA';
  timeout?: number;
  wait?: number;
  ignore?: string[];
  actions?: string[];
  // Advanced options
  username?: string;
  password?: string;
  headers?: Record<string, string>;
  hideElements?: string;
}

export interface Result {
  id: string;
  task: string;
  date: string;
  count: {
    total: number;
    error: number;
    warning: number;
    notice: number;
  };
  score: number;
  ignore: string[];
  results?: Issue[];
}

export interface Issue {
  code: string;
  type: 'error' | 'warning' | 'notice';
  message: string;
  context: string;
  selector: string;
  runner: string;
}

export interface TrendData {
  week: string;
  errors: number;
  warnings: number;
  notices: number;
  score: number;
}

export interface Stats {
  urlCount: number;
  urlLimit: number;
  urlsRemaining: number;
  totalErrors: number;
  totalWarnings: number;
  totalNotices: number;
  averageScore: number;
  plan: string;
  paidUrlCount: number;
}

export interface UsageInfo {
  plan: string;
  freeUrls: number;
  paidUrls: number;
  totalLimit: number;
  currentUsage: number;
  remaining: number;
  pricePerUrl: number;
  pagesPerUrl: number;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

export { ApiError };
