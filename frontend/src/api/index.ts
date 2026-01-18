import { Workout, WorkoutPlan, QuestionnaireData, GeneratePlanResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';

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
    const response = await fetch(`${API_BASE}/workouts/`);
    return handleResponse<Workout[]>(response);
  },

  get: async (id: number): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`);
    return handleResponse<Workout>(response);
  },

  create: async (workout: Omit<Workout, 'id' | 'created_at'>): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    return handleResponse<Workout>(response);
  },

  update: async (id: number, workout: Partial<Workout>): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    return handleResponse<Workout>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/workouts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete workout');
  },

  addExercise: async (workoutId: number, exercise: { name: string; sets: Array<{ set_number: number; reps?: number; weight?: number }> }): Promise<Workout> => {
    const response = await fetch(`${API_BASE}/workouts/${workoutId}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setData),
    });
    if (!response.ok) throw new Error('Failed to update set');
  },
};

// Plans API
export const plansApi = {
  getAll: async (): Promise<WorkoutPlan[]> => {
    const response = await fetch(`${API_BASE}/plans/`);
    return handleResponse<WorkoutPlan[]>(response);
  },

  getActive: async (): Promise<WorkoutPlan[]> => {
    const response = await fetch(`${API_BASE}/plans/active`);
    return handleResponse<WorkoutPlan[]>(response);
  },

  get: async (id: number): Promise<WorkoutPlan> => {
    const response = await fetch(`${API_BASE}/plans/${id}`);
    return handleResponse<WorkoutPlan>(response);
  },

  generate: async (questionnaireData: QuestionnaireData, cycleType: string): Promise<GeneratePlanResponse> => {
    const response = await fetch(`${API_BASE}/plans/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return handleResponse<WorkoutPlan>(response);
  },

  toggleActive: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/plans/${id}/toggle-active`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to toggle plan');
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/plans/${id}`, {
      method: 'DELETE',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });
    if (!response.ok) throw new Error('Chat request failed');
    const data = await response.json();
    return data.message;
  },
};
