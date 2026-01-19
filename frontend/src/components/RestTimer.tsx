import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDuration?: number; // in seconds
}

const PRESET_TIMES = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '2m', value: 120 },
  { label: '3m', value: 180 },
];

// Simple beep sound using Web Audio API
function playBeep() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    
    // Beep pattern: beep-beep-beep
    setTimeout(() => oscillator.stop(), 150);
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      osc2.connect(gainNode);
      osc2.frequency.value = 800;
      osc2.type = 'sine';
      osc2.start();
      setTimeout(() => osc2.stop(), 150);
    }, 250);
    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      osc3.connect(gainNode);
      osc3.frequency.value = 1000;
      osc3.type = 'sine';
      osc3.start();
      setTimeout(() => osc3.stop(), 300);
    }, 500);
  } catch (e) {
    console.log('Audio not supported');
  }
}

export default function RestTimer({ isOpen, onClose, defaultDuration = 60 }: RestTimerProps) {
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(duration);
      setIsRunning(true);
      setIsComplete(false);
    }
  }, [isOpen, duration]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          if (soundEnabled) playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, soundEnabled]);

  const handlePresetSelect = useCallback((value: number) => {
    setDuration(value);
    setTimeLeft(value);
    setIsRunning(true);
    setIsComplete(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      // Reset and start again
      setTimeLeft(duration);
      setIsComplete(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  }, [isRunning, isComplete, duration]);

  const handleReset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
  }, [duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          
          {/* Timer Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-sm md:w-full"
          >
            <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-dark-700">
                <h3 className="text-lg font-bold text-white">Rest Timer</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Timer Display */}
              <div className="p-6 flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mb-6">
                  {/* Background circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-dark-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={553}
                      strokeDashoffset={553 - (553 * progress) / 100}
                      className={`transition-all duration-1000 ${
                        isComplete 
                          ? 'text-genie-500' 
                          : timeLeft <= 10 
                            ? 'text-red-500' 
                            : 'text-genie-500'
                      }`}
                    />
                  </svg>
                  
                  {/* Time display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-bold font-mono ${
                      isComplete ? 'text-genie-400' : timeLeft <= 10 ? 'text-red-400' : 'text-white'
                    }`}>
                      {formatTime(timeLeft)}
                    </span>
                    {isComplete && (
                      <span className="text-genie-400 text-sm mt-2">Time's up!</span>
                    )}
                  </div>
                </div>

                {/* Preset buttons */}
                <div className="flex gap-2 mb-6 flex-wrap justify-center">
                  {PRESET_TIMES.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        duration === preset.value
                          ? 'bg-genie-500 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="p-4 rounded-full bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className={`p-5 rounded-full transition-all ${
                      isComplete
                        ? 'bg-genie-500 text-white hover:bg-genie-400'
                        : isRunning
                          ? 'bg-orange-500 text-white hover:bg-orange-400'
                          : 'bg-genie-500 text-white hover:bg-genie-400'
                    }`}
                  >
                    {isRunning ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Skip hint */}
              <div className="px-4 pb-4 text-center">
                <p className="text-xs text-dark-500">Tap anywhere outside to skip</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mini timer that shows at bottom of screen
export function MiniRestTimer({ 
  timeLeft, 
  isRunning, 
  onExpand, 
  onClose 
}: { 
  timeLeft: number; 
  isRunning: boolean; 
  onExpand: () => void; 
  onClose: () => void;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-64 z-40"
    >
      <div 
        onClick={onExpand}
        className="bg-dark-800 border border-dark-600 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-dark-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isRunning ? 'bg-genie-500/20' : 'bg-dark-700'
          }`}>
            <span className={`text-lg font-mono font-bold ${
              isRunning ? 'text-genie-400' : 'text-dark-400'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div>
            <p className="text-sm text-white font-medium">Rest Timer</p>
            <p className="text-xs text-dark-400">{isRunning ? 'Tap to expand' : 'Paused'}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
