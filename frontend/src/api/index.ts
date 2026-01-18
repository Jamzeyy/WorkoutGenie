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
