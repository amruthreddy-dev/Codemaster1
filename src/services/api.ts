import {
  EventInfo,
  ParticipantDashboardData,
  MCQQuestion,
  MCQAttempt,
  DebuggingProblem,
  DebuggingSubmission,
  LeaderboardEntry,
  AdminSettings,
} from '../types.ts';

const TOKEN_KEY = 'codemasters_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Network request failed.');
  }

  return data as T;
}

export const api = {
  // Public
  getEventInfo: () => request<EventInfo>('/api/public/event-info'),

  // Auth
  register: (payload: any) => request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (identifier: string, password: string) =>
    request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),
  getMe: () => request<any>('/api/auth/me'),

  // Participant Portal
  getParticipantDashboard: () => request<ParticipantDashboardData>('/api/participant/dashboard'),

  // Round 1 MCQ
  getMCQQuestions: () => request<{ questions: MCQQuestion[]; attempt: MCQAttempt | null; duration_mins: number }>('/api/mcq/questions'),
  startMCQ: () => request<{ attempt: MCQAttempt; remaining_seconds: number; expired: boolean }>('/api/mcq/start', { method: 'POST' }),
  saveMCQAnswer: (question_id: string, option: 'A' | 'B' | 'C' | 'D') =>
    request<{ success: boolean; attempted: number; answers: any }>('/api/mcq/save-answer', {
      method: 'POST',
      body: JSON.stringify({ question_id, option }),
    }),
  recordViolation: (violation_type: string, details?: string) =>
    request<{ violations_count: number; max_violations: number; auto_submitted: boolean; warning: string }>('/api/mcq/violation', {
      method: 'POST',
      body: JSON.stringify({ violation_type, details }),
    }),
  getMCQStatus: () => request<{ started: boolean; remaining_seconds: number; status: string; attempted: number; violations_count: number }>('/api/mcq/status'),
  submitMCQ: () => request<any>('/api/mcq/submit', { method: 'POST' }),

  // Round 2 Debugging
  getDebuggingProblems: () =>
    request<{ problems: DebuggingProblem[]; submissions: DebuggingSubmission[]; duration_mins: number }>('/api/debugging/problems'),
  runDebuggingCode: (problem_id: string, code: string) =>
    request<any>('/api/debugging/run', { method: 'POST', body: JSON.stringify({ problem_id, code }) }),
  submitDebuggingCode: (problem_id: string, code: string) =>
    request<any>('/api/debugging/submit', { method: 'POST', body: JSON.stringify({ problem_id, code }) }),

  // Admin
  getAdminOverview: () => request<any>('/api/admin/overview'),
  getAdminParticipants: () => request<any[]>('/api/admin/participants'),
  toggleParticipantLock: (id: string, disabled: boolean) =>
    request<any>(`/api/admin/participants/${id}/toggle-lock`, { method: 'POST', body: JSON.stringify({ disabled }) }),
  getAdminQuestions: () => request<MCQQuestion[]>('/api/admin/questions'),
  createAdminQuestion: (q: any) => request<MCQQuestion>('/api/admin/questions', { method: 'POST', body: JSON.stringify(q) }),
  updateAdminQuestion: (id: string, q: any) => request<MCQQuestion>(`/api/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(q) }),
  deleteAdminQuestion: (id: string) => request<any>(`/api/admin/questions/${id}`, { method: 'DELETE' }),
  getAdminProblems: () => request<DebuggingProblem[]>('/api/admin/problems'),
  createAdminProblem: (p: any) => request<DebuggingProblem>('/api/admin/problems', { method: 'POST', body: JSON.stringify(p) }),
  updateAdminProblem: (id: string, p: any) => request<DebuggingProblem>(`/api/admin/problems/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deleteAdminProblem: (id: string) => request<any>(`/api/admin/problems/${id}`, { method: 'DELETE' }),
  testRunProblem: (code: string, input: string) =>
    request<any>('/api/admin/problems/test-run', { method: 'POST', body: JSON.stringify({ code, input }) }),
  getAdminResults: () => request<{ results: LeaderboardEntry[]; settings: AdminSettings }>('/api/admin/results'),
  getAdminSettings: () => request<AdminSettings>('/api/admin/settings'),
  updateAdminSettings: (settings: Partial<AdminSettings>) =>
    request<AdminSettings>('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  scorePresentation: (data: any) => request<any>('/api/admin/presentation', { method: 'POST', body: JSON.stringify(data) }),
  updateTimeline: (timeline: any[]) => request<any>('/api/admin/timeline', { method: 'PUT', body: JSON.stringify({ timeline }) }),
  updateRules: (rules: any[]) => request<any>('/api/admin/rules', { method: 'PUT', body: JSON.stringify({ rules }) }),
  updateFAQs: (faqs: any[]) => request<any>('/api/admin/faqs', { method: 'PUT', body: JSON.stringify({ faqs }) }),
  getAdminViolations: () => request<any[]>('/api/admin/violations'),
};
