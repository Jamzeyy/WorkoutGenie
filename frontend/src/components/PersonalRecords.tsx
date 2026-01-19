import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Calendar } from 'lucide-react';
import Card from './Card';

interface PersonalRecord {
  exercise_name: string;
  weight: number;
  reps: number;
  date: string;
  workout_id: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';

// Rank colors and icons
const getRankStyle = (index: number) => {
  if (index === 0) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
  if (index === 1) return { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
  if (index === 2) return { icon: Medal, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
  return { icon: Trophy, color: 'text-genie-400', bg: 'bg-dark-700/50', border: 'border-dark-700' };
};

function PRCard({ pr, index }: { pr: PersonalRecord; index: number }) {
  const rankStyle = getRankStyle(index);
  const RankIcon = rankStyle.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border ${rankStyle.bg} ${rankStyle.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rankStyle.bg}`}>
            <RankIcon className={`w-5 h-5 ${rankStyle.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{pr.exercise_name}</h3>
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <Calendar className="w-3 h-3" />
              {new Date(pr.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${rankStyle.color}`}>{pr.weight}</p>
          <p className="text-xs text-dark-400">lbs × {pr.reps} reps</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PersonalRecords() {
  const [prs, setPRs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchPRs() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/profile/prs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPRs(data);
        }
      } catch (err) {
        console.error('Failed to fetch PRs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPRs();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-dark-700 rounded w-1/3" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-700 rounded-xl" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (prs.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <Trophy className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">No Personal Records Yet</h3>
          <p className="text-dark-400 text-sm">
            Complete workouts with weights to start tracking your PRs!
          </p>
        </div>
      </Card>
    );
  }

  const displayedPRs = showAll ? prs : prs.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-genie-400" />
          <h2 className="text-xl font-semibold text-white">Personal Records</h2>
        </div>
        <span className="text-sm text-dark-400">{prs.length} exercises</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayedPRs.map((pr, index) => (
            <PRCard key={pr.exercise_name} pr={pr} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {prs.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 text-center text-sm text-genie-400 hover:text-genie-300 transition-colors"
        >
          {showAll ? 'Show Less' : `Show All ${prs.length} Records`}
        </button>
      )}
    </div>
  );
}

// PR Celebration Component - shows when a new PR is hit
export function PRCelebration({ 
  exerciseName, 
  newWeight, 
  oldWeight,
  onClose 
}: { 
  exerciseName: string; 
  newWeight: number;
  oldWeight: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
    >
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-500/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 text-lg">🎉</span>
              <h3 className="font-bold text-white">NEW PR!</h3>
            </div>
            <p className="text-white font-medium">{exerciseName}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-400 line-through">{oldWeight}lb</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">{newWeight}lb</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
