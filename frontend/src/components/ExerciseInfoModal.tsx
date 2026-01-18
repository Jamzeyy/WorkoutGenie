import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Target, Lightbulb, PlayCircle } from 'lucide-react';
import { ExerciseInfo } from '../data/exerciseDatabase';

interface ExerciseInfoModalProps {
  exercise: ExerciseInfo | null;
  onClose: () => void;
}

export default function ExerciseInfoModal({ exercise, onClose }: ExerciseInfoModalProps) {
  if (!exercise) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-dark-800 border border-dark-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-genie-600 to-emerald-500 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">{exercise.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {exercise.muscles.map((muscle, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Video */}
            <div className="aspect-video rounded-xl overflow-hidden bg-dark-900">
              <iframe
                src={exercise.videoUrl}
                title={`${exercise.name} tutorial`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-genie-400" />
                <h3 className="font-semibold text-white">How to Perform</h3>
              </div>
              <p className="text-dark-300 leading-relaxed">{exercise.description}</p>
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Pro Tips</h3>
              </div>
              <ul className="space-y-2">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                    <span className="w-5 h-5 rounded-full bg-genie-500/20 text-genie-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-dark-700 bg-dark-850">
            <div className="flex items-center justify-between">
              <a
                href={exercise.videoUrl.replace('/embed/', '/watch?v=')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-genie-400 hover:text-genie-300 transition-colors text-sm"
              >
                <PlayCircle className="w-4 h-4" />
                Watch on YouTube
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
