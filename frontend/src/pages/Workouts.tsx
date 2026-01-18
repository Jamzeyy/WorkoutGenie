import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Dumbbell, Calendar, Clock, ChevronRight, Trash2, X } from 'lucide-react';
import posthog from 'posthog-js';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { workoutsApi } from '../api';
import { Workout } from '../types';
import { format } from 'date-fns';

export default function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    try {
      const data = await workoutsApi.getAll();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateWorkout() {
    if (!newWorkoutName.trim()) return;
    
    setCreating(true);
    try {
      const workout = await workoutsApi.create({
        name: newWorkoutName,
        date: new Date().toISOString(),
        exercises: [],
      });
      posthog.capture('workout_created', { workout_name: newWorkoutName });
      setShowCreateModal(false);
      setNewWorkoutName('');
      navigate(`/workouts/${workout.id}`);
    } catch (error) {
      console.error('Failed to create workout:', error);
      posthog.capture('workout_create_failed', { error: String(error) });
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteWorkout(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await workoutsApi.delete(id);
      posthog.capture('workout_deleted');
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading workouts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-white tracking-wide">WORKOUTS</h1>
          <p className="text-dark-400 mt-1">Track and log your exercises</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-5 h-5" />}>
          New Workout
        </Button>
      </div>

      {/* Workouts List */}
      {workouts.length > 0 ? (
        <div className="space-y-3">
          {workouts.map((workout, index) => (
            <Link key={workout.id} to={`/workouts/${workout.id}`}>
              <Card delay={index * 0.05} className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-genie-400 transition-colors">
                        {workout.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-dark-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(workout.date), 'MMM d, yyyy')}
                        </span>
                        {workout.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {workout.duration_minutes} min
                          </span>
                        )}
                        <span>{workout.exercises.length} exercises</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteWorkout(workout.id!, e)}
                      className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-10 h-10 text-dark-600" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No Workouts Yet</h3>
            <p className="text-dark-400 mb-6">Start tracking your fitness journey</p>
            <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-5 h-5" />}>
              Create Your First Workout
            </Button>
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">New Workout</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <X className="w-5 h-5 text-dark-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    placeholder="e.g., Upper Body, Leg Day, Full Body..."
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:border-genie-500 transition-colors"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkout()}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateWorkout}
                    loading={creating}
                    disabled={!newWorkoutName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
