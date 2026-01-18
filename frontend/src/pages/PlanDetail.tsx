import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, Check, ChevronDown, 
  ChevronUp, Sparkles, Dumbbell, Timer, Info, HelpCircle
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ExerciseInfoModal from '../components/ExerciseInfoModal';
import { plansApi, workoutsApi } from '../api';
import { WorkoutPlan, PlanWeek, PlanDay } from '../types';
import { getExerciseInfo, ExerciseInfo } from '../data/exerciseDatabase';

export default function PlanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingWorkout, setStartingWorkout] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]));
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(null);

  function handleExerciseClick(exerciseName: string) {
    const info = getExerciseInfo(exerciseName);
    if (info) {
      setSelectedExercise(info);
    }
  }

  useEffect(() => {
    if (id) fetchPlan();
  }, [id]);

  async function fetchPlan() {
    try {
      const data = await plansApi.get(parseInt(id!));
      setPlan(data);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
      navigate('/plans');
    } finally {
      setLoading(false);
    }
  }

  function toggleWeek(weekIndex: number) {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekIndex)) {
        newSet.delete(weekIndex);
      } else {
        newSet.add(weekIndex);
      }
      return newSet;
    });
  }

  function toggleDay(weekIndex: number, dayIndex: number) {
    const key = `${weekIndex}-${dayIndex}`;
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }

  async function startWorkoutFromDay(day: PlanDay, weekIndex: number, dayIndex: number) {
    const key = `${weekIndex}-${dayIndex}`;
    setStartingWorkout(key);
    try {
      const workout = await workoutsApi.createFromPlan({
        workout_name: day.workout_name,
        duration_minutes: day.duration_minutes,
        focus: day.focus,
        exercises: day.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: String(ex.reps),
          notes: ex.notes || undefined,
        })),
      });
      // Navigate to the new workout
      navigate(`/workouts/${workout.id}`);
    } catch (error) {
      console.error('Failed to create workout from plan:', error);
    } finally {
      setStartingWorkout(null);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading plan..." />;
  }

  if (!plan) {
    return null;
  }

  const planData = plan.plan_data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/plans')}
          className="p-2 rounded-xl glass hover:bg-dark-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-dark-300" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display text-white tracking-wide">{plan.name}</h1>
            {plan.is_active && (
              <span className="px-2 py-0.5 rounded-full bg-genie-500/20 text-genie-400 text-xs font-medium">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-dark-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {plan.cycle_type}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {plan.cycle_weeks} week{plan.cycle_weeks > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {plan.description && (
        <Card animate={false}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-genie-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-genie-400" />
            </div>
            <div>
              <p className="font-medium text-white">About This Plan</p>
              <p className="text-sm text-dark-400 mt-1">{plan.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Weekly Schedule</h2>
        
        {planData.weekly_schedule?.map((week: PlanWeek, weekIndex: number) => (
          <Card key={weekIndex} animate={false}>
            <button
              onClick={() => toggleWeek(weekIndex)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{week.week_number}</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Week {week.week_number}</p>
                  <p className="text-sm text-dark-400">{week.theme}</p>
                </div>
              </div>
              {expandedWeeks.has(weekIndex) ? (
                <ChevronUp className="w-5 h-5 text-dark-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-dark-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedWeeks.has(weekIndex) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {week.days.map((day: PlanDay, dayIndex: number) => {
                      const dayKey = `${weekIndex}-${dayIndex}`;
                      const isExpanded = expandedDays.has(dayKey);
                      
                      return (
                        <div
                          key={dayIndex}
                          className="bg-dark-800/50 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => toggleDay(weekIndex, dayIndex)}
                            className="w-full p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-genie-400">
                                  {day.day_name.slice(0, 3).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-white">{day.workout_name}</p>
                                <div className="flex items-center gap-3 text-sm text-dark-400">
                                  <span>{day.focus}</span>
                                  <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {day.duration_minutes} min
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-dark-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-dark-400" />
                            )}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 space-y-4">
                                  {/* Start Workout Button */}
                                  <Button
                                    onClick={() => startWorkoutFromDay(day, weekIndex, dayIndex)}
                                    loading={startingWorkout === dayKey}
                                    className="w-full"
                                  >
                                    <Dumbbell className="w-4 h-4 mr-2" />
                                    Start This Workout
                                  </Button>

                                  {/* Warmup */}
                                  {day.warmup && (
                                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                      <p className="text-xs font-medium text-orange-400 mb-1">WARMUP</p>
                                      <p className="text-sm text-dark-300">{day.warmup}</p>
                                    </div>
                                  )}

                                  {/* Exercises */}
                                  <div className="space-y-2">
                                    {/* Hint text */}
                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-genie-500/10 rounded-lg border border-genie-500/20">
                                      <HelpCircle className="w-4 h-4 text-genie-400 flex-shrink-0" />
                                      <p className="text-xs text-genie-300">
                                        <span className="font-medium">Tip:</span> Tap an exercise name to see how to do it with a video demo
                                      </p>
                                    </div>
                                    
                                    {day.exercises.map((exercise, exIndex) => {
                                      const hasInfo = getExerciseInfo(exercise.name) !== null;
                                      return (
                                        <div
                                          key={exIndex}
                                          className="flex items-center justify-between py-3 px-4 bg-dark-700/50 rounded-lg"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-genie-500/20 flex items-center justify-center">
                                              <Dumbbell className="w-4 h-4 text-genie-400" />
                                            </div>
                                            <div>
                                              <button
                                                onClick={() => handleExerciseClick(exercise.name)}
                                                className={`font-medium text-left transition-colors ${
                                                  hasInfo 
                                                    ? 'text-genie-400 hover:text-genie-300 underline decoration-dotted underline-offset-2 cursor-pointer' 
                                                    : 'text-white cursor-default'
                                                }`}
                                                disabled={!hasInfo}
                                              >
                                                {exercise.name}
                                              </button>
                                              {exercise.notes && (
                                                <p className="text-xs text-dark-500 mt-0.5">{exercise.notes}</p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-medium text-genie-400">
                                              {exercise.sets} × {exercise.reps}
                                            </p>
                                            <p className="text-xs text-dark-500">
                                              Rest: {exercise.rest_seconds}s
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Cooldown */}
                                  {day.cooldown && (
                                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                      <p className="text-xs font-medium text-blue-400 mb-1">COOLDOWN</p>
                                      <p className="text-sm text-dark-300">{day.cooldown}</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Tips */}
      {planData.tips && planData.tips.length > 0 && (
        <Card animate={false}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-genie-400" />
            <h3 className="font-semibold text-white">Tips for Success</h3>
          </div>
          <ul className="space-y-2">
            {planData.tips.map((tip: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-dark-300">
                <Check className="w-4 h-4 text-genie-400 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Progression Notes */}
      {planData.progression_notes && (
        <Card animate={false}>
          <h3 className="font-semibold text-white mb-2">What's Next?</h3>
          <p className="text-sm text-dark-400">{planData.progression_notes}</p>
        </Card>
      )}

      {/* Exercise Info Modal */}
      <ExerciseInfoModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
