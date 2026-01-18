import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Check, X, Clock, 
  ChevronDown, ChevronUp, HelpCircle, Trophy, CheckCircle2
} from 'lucide-react';
import posthog from 'posthog-js';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ExerciseInfoModal from '../components/ExerciseInfoModal';
import { workoutsApi } from '../api';
import { Workout, ExerciseSet } from '../types';
import { getExerciseInfo, ExerciseInfo } from '../data/exerciseDatabase';
import { format } from 'date-fns';

const COMMON_EXERCISES = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Push-ups', 'Lunges', 'Bicep Curls', 'Tricep Dips',
  'Plank', 'Leg Press', 'Lat Pulldown', 'Shoulder Press', 'Leg Curls'
];

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [expandedExercises, setExpandedExercises] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(null);

  async function handleCompleteWorkout() {
    if (!workout?.id) return;
    
    setCompleting(true);
    try {
      const updated = await workoutsApi.complete(workout.id);
      setWorkout(updated);
      posthog.capture('workout_completed', { workout_name: workout.name });
      // Show success and redirect to profile
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Failed to complete workout:', error);
    } finally {
      setCompleting(false);
    }
  }

  function handleExerciseClick(exerciseName: string) {
    const info = getExerciseInfo(exerciseName);
    if (info) {
      setSelectedExercise(info);
    }
  }

  useEffect(() => {
    if (id) fetchWorkout();
  }, [id]);

  async function fetchWorkout() {
    try {
      const data = await workoutsApi.get(parseInt(id!));
      setWorkout(data);
      // Expand all exercises by default
      setExpandedExercises(new Set(data.exercises.map((_, i) => i)));
    } catch (error) {
      console.error('Failed to fetch workout:', error);
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExercise() {
    if (!newExerciseName.trim() || !workout) return;
    
    setSaving(true);
    try {
      const updated = await workoutsApi.addExercise(workout.id!, {
        name: newExerciseName,
        sets: [
          { set_number: 1, reps: 10, weight: 0 },
          { set_number: 2, reps: 10, weight: 0 },
          { set_number: 3, reps: 10, weight: 0 },
        ],
      });
      setWorkout(updated);
      setNewExerciseName('');
      setShowAddExercise(false);
      setExpandedExercises(prev => new Set([...prev, updated.exercises.length - 1]));
    } catch (error) {
      console.error('Failed to add exercise:', error);
    } finally {
      setSaving(false);
    }
  }

  function toggleExpand(index: number) {
    setExpandedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  function updateLocalSet(exerciseIndex: number, setIndex: number, updates: Partial<ExerciseSet>) {
    if (!workout) return;
    
    const newWorkout = { ...workout };
    newWorkout.exercises = [...workout.exercises];
    newWorkout.exercises[exerciseIndex] = { ...workout.exercises[exerciseIndex] };
    newWorkout.exercises[exerciseIndex].sets = [...workout.exercises[exerciseIndex].sets];
    newWorkout.exercises[exerciseIndex].sets[setIndex] = {
      ...workout.exercises[exerciseIndex].sets[setIndex],
      ...updates,
    };
    setWorkout(newWorkout);
  }

  if (loading) {
    return <LoadingSpinner message="Loading workout..." />;
  }

  if (!workout) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/workouts')}
          className="p-2 rounded-xl glass hover:bg-dark-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-dark-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display text-white tracking-wide">{workout.name}</h1>
          <div className="flex items-center gap-4 text-sm text-dark-400 mt-1">
            <span>{format(new Date(workout.date), 'EEEE, MMMM d, yyyy')}</span>
            {workout.duration_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {workout.duration_minutes} min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {/* Hint text */}
        {workout.exercises.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-genie-500/10 rounded-xl border border-genie-500/20">
            <HelpCircle className="w-4 h-4 text-genie-400 flex-shrink-0" />
            <p className="text-sm text-genie-300">
              <span className="font-medium">Tip:</span> Tap an exercise name to see how to do it with a video demo
            </p>
          </div>
        )}

        {workout.exercises.map((exercise, exerciseIndex) => {
          const hasInfo = getExerciseInfo(exercise.name) !== null;
          return (
          <Card key={exercise.id || exerciseIndex} delay={exerciseIndex * 0.05} animate={false}>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-genie-500/20 flex items-center justify-center text-sm font-bold text-genie-400">
                  {exerciseIndex + 1}
                </div>
                <button
                  onClick={() => handleExerciseClick(exercise.name)}
                  className={`font-semibold text-left transition-colors ${
                    hasInfo 
                      ? 'text-genie-400 hover:text-genie-300 underline decoration-dotted underline-offset-2 cursor-pointer' 
                      : 'text-white cursor-default'
                  }`}
                  disabled={!hasInfo}
                >
                  {exercise.name}
                </button>
                <span className="text-sm text-dark-400">{exercise.sets.length} sets</span>
              </div>
              <button onClick={() => toggleExpand(exerciseIndex)}>
                {expandedExercises.has(exerciseIndex) ? (
                  <ChevronUp className="w-5 h-5 text-dark-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {expandedExercises.has(exerciseIndex) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-2 text-xs text-dark-400 font-medium px-1">
                      <div className="col-span-1">SET</div>
                      <div className="col-span-2">TYPE</div>
                      <div className="col-span-3">WEIGHT</div>
                      <div className="col-span-2">REPS</div>
                      <div className="col-span-3">NOTES</div>
                      <div className="col-span-1 text-center">✓</div>
                    </div>
                    
                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <div
                        key={set.id || setIndex}
                        className={`rounded-xl transition-colors ${
                          set.completed ? 'bg-genie-500/10' : 'bg-dark-800/50'
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-2 items-center p-2">
                          <div className="col-span-1 text-center font-medium text-dark-300">
                            {set.set_number}
                          </div>
                          <div className="col-span-2">
                            <select
                              value={set.set_type || 'regular'}
                              onChange={(e) => updateLocalSet(exerciseIndex, setIndex, { set_type: e.target.value as ExerciseSet['set_type'] })}
                              className="w-full px-1 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-xs focus:border-genie-500"
                            >
                              <option value="regular">Regular</option>
                              <option value="warmup">Warmup</option>
                              <option value="myorep">Myo-Rep</option>
                              <option value="dropset">Drop Set</option>
                              <option value="failure">To Failure</option>
                            </select>
                          </div>
                          <div className="col-span-3">
                            <div className="relative">
                              <input
                                type="number"
                                value={set.weight || ''}
                                onChange={(e) => updateLocalSet(exerciseIndex, setIndex, { 
                                  weight: e.target.value ? parseFloat(e.target.value) : undefined 
                                })}
                                placeholder="0"
                                className="w-full px-2 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-center text-sm focus:border-genie-500"
                              />
                              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-dark-500">lb</span>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => updateLocalSet(exerciseIndex, setIndex, { 
                                reps: e.target.value ? parseInt(e.target.value) : undefined 
                              })}
                              placeholder="0"
                              className="w-full px-2 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-center text-sm focus:border-genie-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={set.notes || ''}
                              onChange={(e) => updateLocalSet(exerciseIndex, setIndex, { notes: e.target.value })}
                              placeholder="Notes..."
                              className="w-full px-2 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-xs focus:border-genie-500"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <button
                              onClick={() => updateLocalSet(exerciseIndex, setIndex, { completed: !set.completed })}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                set.completed 
                                  ? 'bg-genie-500 text-white' 
                                  : 'bg-dark-700 text-dark-500 hover:bg-dark-600'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Set type badge for special sets */}
                        {set.set_type && set.set_type !== 'regular' && (
                          <div className="px-2 pb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              set.set_type === 'myorep' ? 'bg-purple-500/20 text-purple-400' :
                              set.set_type === 'dropset' ? 'bg-orange-500/20 text-orange-400' :
                              set.set_type === 'failure' ? 'bg-red-500/20 text-red-400' :
                              set.set_type === 'warmup' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-dark-600 text-dark-400'
                            }`}>
                              {set.set_type === 'myorep' && '💪 Myo-Rep Set'}
                              {set.set_type === 'dropset' && '⬇️ Drop Set'}
                              {set.set_type === 'failure' && '🔥 To Failure'}
                              {set.set_type === 'warmup' && '🔄 Warmup'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          );
        })}
      </div>

      {/* Add Exercise */}
      <AnimatePresence>
        {showAddExercise ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card animate={false}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Add Exercise</h3>
                  <button
                    onClick={() => setShowAddExercise(false)}
                    className="p-1 rounded-lg hover:bg-dark-700"
                  >
                    <X className="w-5 h-5 text-dark-400" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="Exercise name..."
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-genie-500"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
                />
                
                {/* Quick Select */}
                <div className="flex flex-wrap gap-2">
                  {COMMON_EXERCISES.slice(0, 8).map((name) => (
                    <button
                      key={name}
                      onClick={() => setNewExerciseName(name)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        newExerciseName === name 
                          ? 'bg-genie-500 text-white' 
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowAddExercise(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddExercise}
                    loading={saving}
                    disabled={!newExerciseName.trim()}
                  >
                    Add Exercise
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setShowAddExercise(true)}
              className="w-full py-4 border-2 border-dashed border-dark-700 rounded-2xl text-dark-400 hover:text-genie-400 hover:border-genie-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Notes */}
      <Card animate={false}>
        <h3 className="font-semibold text-white mb-3">Notes</h3>
        <textarea
          value={workout.notes || ''}
          onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
          placeholder="Add notes about your workout..."
          rows={3}
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 resize-none focus:border-genie-500"
        />
      </Card>

      {/* Complete Workout Button */}
      {workout.completed_at ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-emerald-500/20 to-genie-500/20 border border-emerald-500/30 rounded-2xl text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-emerald-400">Workout Complete!</h3>
          <p className="text-dark-300 mt-1">
            Finished on {format(new Date(workout.completed_at), 'MMM d, yyyy \'at\' h:mm a')}
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate('/profile')}
          >
            <Trophy className="w-4 h-4 mr-2" />
            View Progress
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-20 md:bottom-4"
        >
          <Button
            onClick={handleCompleteWorkout}
            loading={completing}
            className="w-full py-4 text-lg bg-gradient-to-r from-emerald-500 to-genie-500 hover:from-emerald-600 hover:to-genie-600"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Complete Workout
          </Button>
        </motion.div>
      )}

      {/* Exercise Info Modal */}
      <ExerciseInfoModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
