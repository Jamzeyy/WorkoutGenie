import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Edit2, Save, X, Flame, Target, Trophy, Calendar,
  TrendingUp, Dumbbell, Scale, Ruler, Activity, Crown, Zap, HelpCircle
} from 'lucide-react';
import { resetOnboarding } from '../components/OnboardingTour';

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { profileApi, UserProfile, UserStats, Milestone } from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressCharts from '../components/ProgressCharts';
import PersonalRecords from '../components/PersonalRecords';

const GENDERS = ['male', 'female', 'other'];
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: '3-5 days/week' },
  { value: 'active', label: 'Active', desc: '6-7 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Intense exercise daily' },
];

const FITNESS_GOALS = [
  'Build Muscle',
  'Lose Weight',
  'Build Strength',
  'Improve Endurance',
  'General Fitness',
  'Athletic Performance',
];

export default function Profile() {
  const { user } = useAuth();
  const { subscription, isPro, inTrial, trialDaysRemaining, limits } = useSubscription();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const personalDataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileData, statsData] = await Promise.all([
        profileApi.get(),
        profileApi.getStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }

  function startEditing() {
    setEditForm({
      name: profile?.name || '',
      height_cm: profile?.height_cm,
      weight_kg: profile?.weight_kg,
      age: profile?.age,
      gender: profile?.gender,
      fitness_goal: profile?.fitness_goal,
      activity_level: profile?.activity_level,
    });
    setEditing(true);
    // Scroll to personal data section after state update
    setTimeout(() => {
      personalDataRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const updated = await profileApi.update(editForm);
      setProfile(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  }

  function getCalendarColor(day: { completed: boolean; date: string }) {
    const today = new Date().toISOString().split('T')[0];
    if (day.date > today) return 'bg-dark-800'; // Future
    if (day.completed) return 'bg-emerald-500'; // Completed
    return 'bg-red-500/50'; // Missed
  }

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-genie-500 to-emerald-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display text-white">{profile?.name || user?.email}</h1>
            <p className="text-dark-400">{profile?.email}</p>
          </div>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={startEditing}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card animate={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-genie-500/20 rounded-lg">
              <Dumbbell className="w-5 h-5 text-genie-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.completed_workouts || 0}</p>
              <p className="text-xs text-dark-400">Workouts Done</p>
            </div>
          </div>
        </Card>
        <Card animate={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.current_streak || 0}</p>
              <p className="text-xs text-dark-400">Day Streak</p>
            </div>
          </div>
        </Card>
        <Card animate={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.this_week || 0}</p>
              <p className="text-xs text-dark-400">This Week</p>
            </div>
          </div>
        </Card>
        <Card animate={false}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.longest_streak || 0}</p>
              <p className="text-xs text-dark-400">Best Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subscription Status */}
      <Card animate={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isPro ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-dark-700'}`}>
              {isPro ? (
                <Crown className="w-6 h-6 text-amber-400" />
              ) : (
                <Zap className="w-6 h-6 text-dark-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {inTrial ? 'Free Trial' : isPro ? 'Pro Member' : 'Free Plan'}
                </h3>
                {inTrial && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    trialDaysRemaining <= 2 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-genie-500/20 text-genie-400'
                  }`}>
                    {trialDaysRemaining === 0 
                      ? 'Ends today!' 
                      : `${trialDaysRemaining} days left`
                    }
                  </span>
                )}
                {isPro && !inTrial && subscription?.plan && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                    {subscription.plan === 'two_year' ? '2 Year' : subscription.plan === 'annual' ? 'Annual' : 'Monthly'}
                  </span>
                )}
              </div>
              <p className="text-sm text-dark-400">
                {inTrial 
                  ? `Enjoy unlimited Pro features! Trial ends ${subscription?.trial_ends_at ? new Date(subscription.trial_ends_at).toLocaleDateString() : 'soon'}`
                  : isPro 
                    ? `Renews ${subscription?.ends_at ? new Date(subscription.ends_at).toLocaleDateString() : 'soon'}`
                    : `${limits?.workouts_used || 0}/${limits?.monthly_workouts} workouts • ${limits?.chat_used || 0}/${limits?.daily_chat_messages} chats today`
                }
              </p>
            </div>
          </div>
          {(inTrial || !isPro) && (
            <Link to="/pricing">
              <Button size="sm" className="bg-gradient-to-r from-genie-500 to-purple-500">
                <Crown className="w-4 h-4 mr-1" />
                {inTrial ? 'Keep Pro' : 'Upgrade'}
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Workout Calendar */}
      <Card animate={false}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-genie-400" />
          <h2 className="text-lg font-semibold text-white">Workout Calendar</h2>
        </div>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-dark-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/50"></div>
            <span className="text-dark-400">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-dark-700"></div>
            <span className="text-dark-400">Future</span>
          </div>
        </div>
        <div className="grid grid-cols-10 md:grid-cols-15 gap-1">
          {stats?.workout_calendar.map((day, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm ${getCalendarColor(day)} transition-colors hover:opacity-80`}
              title={`${day.date}${day.completed ? ` - ${day.workout_name}` : ''}`}
            />
          ))}
        </div>
        <p className="text-xs text-dark-500 mt-2">Last 60 days</p>
      </Card>

      {/* Milestones */}
      <Card animate={false}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-genie-400" />
          <h2 className="text-lg font-semibold text-white">Milestones</h2>
        </div>
        <div className="grid gap-3">
          {stats?.milestones.map((milestone: Milestone, i: number) => (
            <div
              key={i}
              className={`p-3 rounded-xl border ${
                milestone.completed 
                  ? 'bg-genie-500/10 border-genie-500/30' 
                  : 'bg-dark-800/50 border-dark-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{milestone.icon}</span>
                  <div>
                    <p className={`font-medium ${milestone.completed ? 'text-genie-400' : 'text-white'}`}>
                      {milestone.name}
                    </p>
                    <p className="text-xs text-dark-400">{milestone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${milestone.completed ? 'text-genie-400' : 'text-white'}`}>
                    {milestone.current}/{milestone.target}
                  </p>
                  {milestone.completed && (
                    <span className="text-xs text-genie-400">✓ Complete</span>
                  )}
                </div>
              </div>
              {!milestone.completed && (
                <div className="mt-2 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-genie-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Charts */}
      <ProgressCharts />

      {/* Personal Records */}
      <PersonalRecords />

      {/* Personal Data */}
      <div ref={personalDataRef}>
        <Card animate={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-genie-400" />
              <h2 className="text-lg font-semibold text-white">Personal Data</h2>
            </div>
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300"
              >
                <X className="w-4 h-4" />
              </button>
              <Button onClick={saveProfile} loading={saving} size="sm">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-400 mb-1">Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Age</label>
              <input
                type="number"
                value={editForm.age || ''}
                onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={editForm.height_cm || ''}
                onChange={(e) => setEditForm({ ...editForm, height_cm: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={editForm.weight_kg || ''}
                onChange={(e) => setEditForm({ ...editForm, weight_kg: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Gender</label>
              <select
                value={editForm.gender || ''}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              >
                <option value="">Select...</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-400 mb-1">Fitness Goal</label>
              <select
                value={editForm.fitness_goal || ''}
                onChange={(e) => setEditForm({ ...editForm, fitness_goal: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              >
                <option value="">Select...</option>
                {FITNESS_GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-dark-400 mb-1">Activity Level</label>
              <select
                value={editForm.activity_level || ''}
                onChange={(e) => setEditForm({ ...editForm, activity_level: e.target.value })}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white"
              >
                <option value="">Select...</option>
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Ruler className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">Height</p>
                <p className="text-white font-medium">
                  {profile?.height_cm ? `${profile.height_cm} cm` : 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Scale className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">Weight</p>
                <p className="text-white font-medium">
                  {profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Activity className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">BMI</p>
                <p className="text-white font-medium">
                  {profile?.bmi ? profile.bmi.toFixed(1) : 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <User className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">Age</p>
                <p className="text-white font-medium">
                  {profile?.age ? `${profile.age} years` : 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Target className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">Fitness Goal</p>
                <p className="text-white font-medium">
                  {profile?.fitness_goal || 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-dark-400" />
              <div>
                <p className="text-sm text-dark-400">Activity Level</p>
                <p className="text-white font-medium">
                  {ACTIVITY_LEVELS.find(l => l.value === profile?.activity_level)?.label || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        )}
        </Card>

        {/* Settings Section */}
        <Card className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-dark-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">App Settings</h3>
              <p className="text-sm text-dark-400">Customize your experience</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={async () => {
                // Reset in backend
                const token = localStorage.getItem('token');
                if (token) {
                  try {
                    await fetch(`${API_BASE}/auth/reset-onboarding`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}` },
                    });
                  } catch (e) {
                    console.error('Failed to reset onboarding:', e);
                  }
                }
                // Also reset localStorage
                resetOnboarding();
                window.location.reload();
              }}
              className="w-full flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-700/50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧞‍♂️</span>
                <div className="text-left">
                  <p className="text-white font-medium group-hover:text-genie-400 transition-colors">Replay Tutorial</p>
                  <p className="text-xs text-dark-400">Get a quick tour of all features</p>
                </div>
              </div>
              <span className="text-dark-500 text-sm">→</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
