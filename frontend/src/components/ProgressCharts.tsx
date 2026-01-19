import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Weight, Repeat, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';

interface DataPoint {
  date: string;
  weight: number | null;
  reps: number | null;
  volume: number | null;
}

interface ExerciseProgress {
  exercise_name: string;
  data_points: DataPoint[];
  max_weight: number;
  max_reps: number;
  max_volume: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';

// Simple SVG Line Chart
function LineChart({ 
  data, 
  dataKey, 
  color, 
  height = 120 
}: { 
  data: DataPoint[]; 
  dataKey: 'weight' | 'reps' | 'volume'; 
  color: string;
  height?: number;
}) {
  const values = data.map(d => d[dataKey] || 0).filter(v => v > 0);
  
  if (values.length < 2) {
    return (
      <div className="h-[120px] flex items-center justify-center text-dark-500 text-sm">
        Need more data points
      </div>
    );
  }

  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  
  const width = 100;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Generate path
  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y, val };
  });
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={padding}
            y1={padding + chartHeight * (1 - pct)}
            x2={width - padding}
            y2={padding + chartHeight * (1 - pct)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-dark-700"
          />
        ))}
        
        {/* Area fill */}
        <path
          d={areaD}
          fill={`url(#gradient-${color})`}
          opacity="0.3"
        />
        
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={color}
            className="drop-shadow-sm"
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Min/Max labels */}
      <div className="absolute top-1 right-2 text-[10px] text-dark-500">
        {maxVal.toLocaleString()}
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] text-dark-500">
        {minVal.toLocaleString()}
      </div>
    </div>
  );
}

// Single Exercise Card
function ExerciseCard({ exercise }: { exercise: ExerciseProgress }) {
  const [expanded, setExpanded] = useState(false);
  const [chartType, setChartType] = useState<'weight' | 'reps' | 'volume'>('weight');
  
  const latestWeight = exercise.data_points[exercise.data_points.length - 1]?.weight || 0;
  const firstWeight = exercise.data_points[0]?.weight || 0;
  const weightChange = firstWeight > 0 ? ((latestWeight - firstWeight) / firstWeight * 100).toFixed(0) : 0;

  return (
    <Card className="overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-genie-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-genie-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">{exercise.exercise_name}</h3>
            <p className="text-xs text-dark-400">
              {exercise.data_points.length} workouts • Max: {exercise.max_weight}lb
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {Number(weightChange) !== 0 && (
            <span className={`text-sm font-medium ${Number(weightChange) > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(weightChange) > 0 ? '+' : ''}{weightChange}%
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-dark-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-dark-700"
        >
          {/* Chart type selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartType('weight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                chartType === 'weight' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-dark-700 text-dark-400 hover:text-white'
              }`}
            >
              <Weight className="w-3.5 h-3.5" />
              Weight
            </button>
            <button
              onClick={() => setChartType('reps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                chartType === 'reps' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-dark-700 text-dark-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              Reps
            </button>
            <button
              onClick={() => setChartType('volume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                chartType === 'volume' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-dark-700 text-dark-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Volume
            </button>
          </div>

          {/* Chart */}
          <div className="bg-dark-900/50 rounded-xl p-2">
            <LineChart 
              data={exercise.data_points} 
              dataKey={chartType}
              color={
                chartType === 'weight' ? '#3b82f6' : 
                chartType === 'reps' ? '#a855f7' : 
                '#22c55e'
              }
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-blue-400">{exercise.max_weight}</p>
              <p className="text-[10px] text-dark-400">Max Weight (lb)</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-purple-400">{exercise.max_reps}</p>
              <p className="text-[10px] text-dark-400">Max Reps</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-green-400">{exercise.max_volume.toLocaleString()}</p>
              <p className="text-[10px] text-dark-400">Max Volume</p>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

export default function ProgressCharts() {
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProgress() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/profile/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        }
      } catch (err) {
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-dark-700 rounded w-1/3" />
          <div className="h-24 bg-dark-700 rounded" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-400 text-sm">{error}</p>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <TrendingUp className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">No Progress Data Yet</h3>
          <p className="text-dark-400 text-sm">
            Complete a few workouts with the same exercises to see your progress charts here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Exercise Progress</h2>
        <span className="text-sm text-dark-400">{exercises.length} tracked</span>
      </div>
      
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.exercise_name} exercise={exercise} />
      ))}
    </div>
  );
}
