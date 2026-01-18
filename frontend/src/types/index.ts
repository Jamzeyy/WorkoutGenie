export interface ExerciseSet {
  id?: number;
  set_number: number;
  reps?: number;
  weight?: number;
  duration_seconds?: number;
  completed: boolean;
  notes?: string;  // For myoreps, drop sets, RPE, etc.
  set_type?: 'regular' | 'warmup' | 'dropset' | 'myorep' | 'failure';
}

export interface Exercise {
  id?: number;
  name: string;
  order: number;
  sets: ExerciseSet[];
}

export interface Workout {
  id?: number;
  name: string;
  date: string;
  duration_minutes?: number;
  notes?: string;
  exercises: Exercise[];
  created_at?: string;
  completed_at?: string;
}

export interface QuestionnaireData {
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  primary_goal: 'strength' | 'muscle_building' | 'weight_loss' | 'endurance' | 'general_fitness';
  workout_days_per_week: number;
  workout_duration_minutes: number;
  available_equipment: string[];
  focus_areas: string[];
  injuries_limitations?: string;
  extra_comments?: string;
}

export interface PlanExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface PlanDay {
  day_number: number;
  day_name: string;
  workout_name: string;
  focus: string;
  duration_minutes: number;
  warmup: string;
  exercises: PlanExercise[];
  cooldown: string;
}

export interface PlanWeek {
  week_number: number;
  theme: string;
  days: PlanDay[];
}

export interface PlanData {
  plan_name: string;
  plan_description: string;
  weekly_schedule: PlanWeek[];
  tips: string[];
  progression_notes: string;
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  description?: string;
  cycle_type: 'weekly' | 'monthly' | 'bi-monthly';
  cycle_weeks: number;
  questionnaire_data?: QuestionnaireData;
  plan_data: PlanData;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratePlanResponse {
  plan_name: string;
  plan_description: string;
  plan_data: PlanData;
  cycle_type: string;
  cycle_weeks: number;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  is_admin: boolean;
}

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  is_admin: boolean;
  created_at: string;
  workout_count: number;
  plan_count: number;
}
