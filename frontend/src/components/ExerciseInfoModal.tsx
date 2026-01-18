import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Target, Lightbulb, PlayCircle, AlertTriangle, Check, Heart, ExternalLink } from 'lucide-react';
import { ExerciseInfo } from '../data/exerciseDatabase';
import { feedbackApi } from '../api';

interface ExerciseInfoModalProps {
  exercise: ExerciseInfo | null;
  onClose: () => void;
}

export default function ExerciseInfoModal({ exercise, onClose }: ExerciseInfoModalProps) {
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState('');

  if (!exercise) return null;

  const handleReport = async (issueType: string) => {
    try {
      await feedbackApi.submit({
        exercise_name: exercise.name,
        issue_type: issueType,
      });
      setReportSent(true);
      setShowReportMenu(false);
      setTimeout(() => setReportSent(false), 3000);
    } catch (err) {
      setReportError('Failed to send report');
      setTimeout(() => setReportError(''), 3000);
    }
  };

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

            {/* Creator Attribution Disclaimer */}
            <div className="flex items-start gap-3 p-3 bg-dark-700/30 border border-dark-600/50 rounded-xl">
              <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-dark-400 leading-relaxed">
                <p>
                  This video is from an independent creator on YouTube, not WorkoutGenie. 
                  If you found it helpful, please{' '}
                  <a
                    href={exercise.videoUrl.replace('/embed/', '/watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-genie-400 hover:text-genie-300 underline inline-flex items-center gap-1"
                  >
                    support them by subscribing
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {' '}to their channel!
                </p>
              </div>
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
              <div className="flex items-center gap-3">
                <a
                  href={exercise.videoUrl.replace('/embed/', '/watch?v=')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-genie-400 hover:text-genie-300 transition-colors text-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch on YouTube
                </a>
                
                {/* Report Issue Button */}
                <div className="relative">
                  {reportSent ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Check className="w-4 h-4" />
                      Reported!
                    </span>
                  ) : reportError ? (
                    <span className="text-red-400 text-sm">{reportError}</span>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowReportMenu(!showReportMenu)}
                        className="flex items-center gap-1 text-dark-400 hover:text-yellow-400 transition-colors text-sm"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Report Issue
                      </button>
                      
                      {showReportMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl py-1 min-w-[180px] z-10">
                          <button
                            onClick={() => handleReport('video_private')}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 transition-colors"
                          >
                            🔒 Video is Private
                          </button>
                          <button
                            onClick={() => handleReport('video_wrong')}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 transition-colors"
                          >
                            ❌ Wrong Exercise
                          </button>
                          <button
                            onClick={() => handleReport('video_broken')}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 transition-colors"
                          >
                            ⚠️ Video Not Loading
                          </button>
                          <button
                            onClick={() => handleReport('other')}
                            className="w-full px-3 py-2 text-left text-sm text-dark-200 hover:bg-dark-600 transition-colors"
                          >
                            📝 Other Issue
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
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
