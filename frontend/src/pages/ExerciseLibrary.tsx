import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Dumbbell, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import ExerciseInfoModal from '../components/ExerciseInfoModal';
import { getAllExercises, ExerciseInfo } from '../data/exerciseDatabase';

// Get unique muscle groups from all exercises
function getUniqueMuscles(exercises: ExerciseInfo[]): string[] {
  const muscles = new Set<string>();
  exercises.forEach(ex => {
    ex.muscles.forEach(m => muscles.add(m));
  });
  return Array.from(muscles).sort();
}

// Muscle group colors
const muscleColors: Record<string, string> = {
  'Chest': 'bg-red-500/20 text-red-400',
  'Upper Chest': 'bg-red-500/20 text-red-400',
  'Back': 'bg-blue-500/20 text-blue-400',
  'Upper Back': 'bg-blue-500/20 text-blue-400',
  'Lats': 'bg-blue-500/20 text-blue-400',
  'Shoulders': 'bg-orange-500/20 text-orange-400',
  'Triceps': 'bg-purple-500/20 text-purple-400',
  'Biceps': 'bg-pink-500/20 text-pink-400',
  'Forearms': 'bg-pink-500/20 text-pink-400',
  'Core': 'bg-yellow-500/20 text-yellow-400',
  'Abs': 'bg-yellow-500/20 text-yellow-400',
  'Obliques': 'bg-yellow-500/20 text-yellow-400',
  'Quadriceps': 'bg-green-500/20 text-green-400',
  'Hamstrings': 'bg-emerald-500/20 text-emerald-400',
  'Glutes': 'bg-teal-500/20 text-teal-400',
  'Calves': 'bg-cyan-500/20 text-cyan-400',
  'Hip Flexors': 'bg-lime-500/20 text-lime-400',
};

function getMuscleColor(muscle: string): string {
  return muscleColors[muscle] || 'bg-dark-600 text-dark-300';
}

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allExercises = useMemo(() => getAllExercises(), []);
  const allMuscles = useMemo(() => getUniqueMuscles(allExercises), [allExercises]);

  // Filter exercises based on search and muscle filter
  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      const matchesSearch = searchQuery === '' || 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesMuscle = !selectedMuscle || 
        exercise.muscles.includes(selectedMuscle);

      return matchesSearch && matchesMuscle;
    });
  }, [allExercises, searchQuery, selectedMuscle]);

  // Group exercises by primary muscle
  const groupedExercises = useMemo(() => {
    const groups: Record<string, ExerciseInfo[]> = {};
    
    filteredExercises.forEach(exercise => {
      const primaryMuscle = exercise.muscles[0] || 'Other';
      if (!groups[primaryMuscle]) {
        groups[primaryMuscle] = [];
      }
      groups[primaryMuscle].push(exercise);
    });

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredExercises]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display text-white tracking-wide">Exercise Library</h1>
        <p className="text-dark-400 mt-1">{allExercises.length} exercises with video tutorials</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search exercises or muscle groups..."
          className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:border-genie-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-dark-700"
          >
            <X className="w-4 h-4 text-dark-400" />
          </button>
        )}
      </div>

      {/* Filter Toggle & Active Filter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            showFilters || selectedMuscle
              ? 'bg-genie-500/20 text-genie-400'
              : 'bg-dark-800 text-dark-400 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filter by Muscle
        </button>
        
        {selectedMuscle && (
          <button
            onClick={() => setSelectedMuscle(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${getMuscleColor(selectedMuscle)}`}
          >
            {selectedMuscle}
            <X className="w-3 h-3" />
          </button>
        )}

        <span className="text-sm text-dark-500 ml-auto">
          {filteredExercises.length} result{filteredExercises.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Muscle Filter Chips */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <Card className="!p-4">
            <p className="text-xs text-dark-400 mb-3 uppercase tracking-wider">Filter by muscle group</p>
            <div className="flex flex-wrap gap-2">
              {allMuscles.map(muscle => (
                <button
                  key={muscle}
                  onClick={() => {
                    setSelectedMuscle(selectedMuscle === muscle ? null : muscle);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedMuscle === muscle
                      ? getMuscleColor(muscle)
                      : 'bg-dark-700 text-dark-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Exercise List */}
      {filteredExercises.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No Exercises Found</h3>
            <p className="text-dark-400 text-sm">
              Try a different search term or clear your filters.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedExercises.map(([muscle, exercises]) => (
            <div key={muscle}>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getMuscleColor(muscle).split(' ')[0]}`} />
                {muscle}
                <span className="text-sm text-dark-500 font-normal">({exercises.length})</span>
              </h2>
              
              <div className="space-y-2">
                {exercises.map((exercise, i) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <button
                      onClick={() => setSelectedExercise(exercise)}
                      className="w-full bg-dark-800/50 hover:bg-dark-700/50 border border-dark-700 rounded-xl p-4 transition-colors group text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white group-hover:text-genie-400 transition-colors">
                            {exercise.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {exercise.muscles.map(m => (
                              <span
                                key={m}
                                className={`px-2 py-0.5 rounded-full text-[10px] ${getMuscleColor(m)}`}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Info Modal */}
      <ExerciseInfoModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
