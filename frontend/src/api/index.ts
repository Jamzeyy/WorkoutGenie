import { Workout, WorkoutPlan, QuestionnaireData, GeneratePlanResponse, AdminUser } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  return response.json();
}

// Workouts API
export const workoutsApi = {
  getAll: async (): Promise<Workout[]> => {
    const response = await fetch(`${API_BASE}/workouts/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Workout[]>(response);
  },

  get: async (id: number): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Workout>(response);
  },

  create: async (workout: Omit<Workout, 'id' | 'created_at'>): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(workout),
    });
    return handleResponse<Workout>(response);
  },

  update: async (id: number, workout: Partial<Workout>): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(workout),
    });
    return handleResponse<Workout>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete workout');
  },

  addExercise: async (workoutId: number, exercise: { name: string; sets: Array<{ set_number: number; reps?: number; weight?: number }> }): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${workoutId}/exercises`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(exercise),
    });
    return handleResponse<Workout>(response);
  },

  createFromPlan: async (planDay: {
    workout_name: string;
    duration_minutes?: number;
    focus?: string;
    exercises: Array<{ name: string; sets: number; reps: string; notes?: string }>;
  }): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/from-plan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planDay),
    });
    return handleResponse<Workout>(response);
  },

  updateSet: async (setId: number, setData: {
    set_number: number;
    reps?: number;
    weight?: number;
    completed: boolean;
    notes?: string;
    set_type?: string;
  }): Promise<void> => {
    const response = await fetch(`${API_BASE}/workouts/sets/${setId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(setData),
    });
    if (!response.ok) throw new Error('Failed to update set');
  },

  complete: async (id: number): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<Workout>(response);
  },

  uncomplete: async (id: number): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}/uncomplete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<Workout>(response);
  },
};

// Plans API
export const plansApi = {
  getAll: async (): Promise<WorkoutPlan[]> => {
    const response = await fetch(`${API_BASE}/plans/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<WorkoutPlan[]>(response);
  },

  getActive: async (): Promise<WorkoutPlan[]> => {
    const response = await fetch(`${API_BASE}/plans/active`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<WorkoutPlan[]>(response);
  },

  get: async (id: number): Promise<WorkoutPlan> => {
    const response = await fetch(`${API_BASE}/plans/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<WorkoutPlan>(response);
  },

  generate: async (questionnaireData: QuestionnaireData, cycleType: string): Promise<GeneratePlanResponse> => {
    const response = await fetch(`${API_BASE}/plans/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        questionnaire_data: questionnaireData,
        cycle_type: cycleType,
      }),
    });
    return handleResponse<GeneratePlanResponse>(response);
  },

  save: async (plan: {
    name: string;
    description?: string;
    cycle_type: string;
    questionnaire_data: QuestionnaireData;
    plan_data: unknown;
  }): Promise<WorkoutPlan> => {
    const response = await fetch(`${API_BASE}/plans/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });
    return handleResponse<WorkoutPlan>(response);
  },

  toggleActive: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/plans/${id}/toggle-active`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle plan');
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/plans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete plan');
  },
};

// Chat API
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatApi = {
  send: async (messages: ChatMessage[], context?: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/chat/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messages, context }),
    });
    if (!response.ok) throw new Error('Chat request failed');
    const data = await response.json();
    return data.message;
  },
};

// Profile API
export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  gender?: string;
  fitness_goal?: string;
  activity_level?: string;
  bmi?: number;
  created_at: string;
}

export interface WorkoutStat {
  date: string;
  completed: boolean;
  workout_name?: string;
  workout_id?: number;
}

export interface Milestone {
  name: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  icon: string;
}

export interface UserStats {
  total_workouts: number;
  completed_workouts: number;
  current_streak: number;
  longest_streak: number;
  this_week: number;
  this_month: number;
  total_exercises: number;
  workout_calendar: WorkoutStat[];
  milestones: Milestone[];
}

export const profileApi = {
  get: async (): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE}/profile/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserProfile>(response);
  },

  update: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE}/profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserProfile>(response);
  },

  getStats: async (): Promise<UserStats> => {
    const response = await fetch(`${API_BASE}/profile/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserStats>(response);
  },
};

// Admin API
export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await fetch(`${API_BASE}/auth/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminUser[]>(response);
  },

  deleteUser: async (userId: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};

// Feedback API
export interface FeedbackReport {
  id: number;
  user_id?: number;
  exercise_name: string;
  issue_type: string;
  message?: string;
  status: string;
  created_at: string;
  resolved_at?: string;
}

export const feedbackApi = {
  submit: async (data: { exercise_name: string; issue_type: string; message?: string }): Promise<FeedbackReport> => {
    const response = await fetch(`${API_BASE}/feedback/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FeedbackReport>(response);
  },

  getAll: async (status?: string): Promise<FeedbackReport[]> => {
    const url = status ? `${API_BASE}/feedback/reports?status=${status}` : `${API_BASE}/feedback/reports`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FeedbackReport[]>(response);
  },

  updateStatus: async (id: number, status: string): Promise<FeedbackReport> => {
    const response = await fetch(`${API_BASE}/feedback/reports/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<FeedbackReport>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/feedback/reports/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete report');
  },
};
