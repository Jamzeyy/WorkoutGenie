import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, MessageSquare, 
  Dumbbell, Calendar, User, CheckCircle2, Rocket
} from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  tips?: { emoji: string; text: string }[];
  image?: string; // URL to screenshot/preview image
}

// Tutorial screenshot images - replace these URLs with your actual screenshots
const TOUR_IMAGES = {
  welcome: '/tutorial/welcome.png',
  aiChat: '/tutorial/ai-chat.png',
  generate: '/tutorial/generate.png',
  workouts: '/tutorial/workouts.png',
  plans: '/tutorial/plans.png',
  profile: '/tutorial/profile.png',
  proTips: '/tutorial/pro-tips.png',
  complete: '/tutorial/complete.png',
};

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to WorkoutGenie! 🧞‍♂️',
    description: "Your AI-powered fitness companion. Let me show you around - this will only take a moment.",
    icon: <Rocket className="w-8 h-8" />,
    image: TOUR_IMAGES.welcome,
  },
  {
    id: 'ai-chat',
    title: 'AI Fitness Coach',
    description: 'Ask me anything about workouts, nutrition, form tips, or fitness advice. I\'m here 24/7!',
    icon: <MessageSquare className="w-6 h-6" />,
    targetSelector: '[data-tour="ai-chat"]',
    position: 'bottom',
    image: TOUR_IMAGES.aiChat,
  },
  {
    id: 'generate',
    title: 'Generate Custom Plans',
    description: 'Answer a few questions and I\'ll create a personalized workout plan tailored just for you.',
    icon: <Sparkles className="w-6 h-6" />,
    targetSelector: '[data-tour="generate"]',
    position: 'bottom',
    image: TOUR_IMAGES.generate,
  },
  {
    id: 'workouts',
    title: 'Track Your Workouts',
    description: 'Log exercises, sets, reps, and weights. Watch your progress over time!',
    icon: <Dumbbell className="w-6 h-6" />,
    targetSelector: '[data-tour="workouts"]',
    position: 'top',
    image: TOUR_IMAGES.workouts,
  },
  {
    id: 'plans',
    title: 'Your Workout Plans',
    description: 'View and follow your AI-generated or custom workout plans here.',
    icon: <Calendar className="w-6 h-6" />,
    targetSelector: '[data-tour="plans"]',
    position: 'top',
    image: TOUR_IMAGES.plans,
  },
  {
    id: 'profile',
    title: 'Personalize Your Experience',
    description: 'Add your fitness goals, body stats, and preferences for better recommendations.',
    icon: <User className="w-6 h-6" />,
    targetSelector: '[data-tour="profile"]',
    position: 'top',
    image: TOUR_IMAGES.profile,
  },
  {
    id: 'pro-tips',
    title: 'Pro Tips 💡',
    description: '',
    icon: <Sparkles className="w-8 h-8" />,
    tips: [
      { emoji: '🎬', text: 'Tap any exercise name to see a video tutorial and form tips' },
      { emoji: '▶️', text: 'Inside a plan, tap "Start Workout" to log it directly' },
      { emoji: '📊', text: 'Your stats update automatically as you complete workouts' },
    ],
    image: TOUR_IMAGES.proTips,
  },
  {
    id: 'complete',
    title: "You're All Set! 💪",
    description: "Start by chatting with me or generating your first workout plan. Let's crush those goals!",
    icon: <CheckCircle2 className="w-8 h-8" />,
    image: TOUR_IMAGES.complete,
  },
];

const ONBOARDING_KEY = 'workoutgenie_onboarding_complete';

export default function OnboardingTour() {
  const { user, markOnboardingComplete } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check for force show via URL parameter (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('tour') === '1';
    
    if (forceShow) {
      // Clear the completion flag and show tour
      localStorage.removeItem(ONBOARDING_KEY);
      setIsVisible(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    
    // Check if user has completed onboarding (from backend or localStorage fallback)
    const hasCompletedBackend = user?.has_seen_onboarding === true;
    const hasCompletedLocal = localStorage.getItem(ONBOARDING_KEY) === 'true';
    
    if (!hasCompletedBackend && !hasCompletedLocal) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);


  const handleComplete = async () => {
    // Mark complete in backend (persists across devices)
    await markOnboardingComplete();
    // Also set localStorage as fallback
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85"
          />


          {/* Tour card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[103] inset-0 flex items-center justify-center p-3 md:p-4"
          >
            <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto max-w-md w-full">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-genie-600 to-emerald-500 p-3 md:p-4 relative">
                <button
                  onClick={handleSkip}
                  className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Skip tour"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-white truncate">{step.title}</h3>
                    <p className="text-xs text-white/70">
                      Step {currentStep + 1} of {TOUR_STEPS.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              {step.image && (
                <div className="px-4 pt-3">
                  <div className="relative rounded-xl overflow-hidden border border-dark-600 bg-dark-900">
                    <img 
                      src={step.image} 
                      alt={`${step.title} preview`}
                      className="w-full h-48 md:h-56 object-contain bg-dark-900"
                      onError={(e) => {
                        // Hide image container if image fails to load
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-3 md:p-5 pt-3">
                {step.description && (
                  <p className="text-dark-300 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                )}

                {/* Pro tips list */}
                {step.tips && (
                  <div className="space-y-2 mb-4">
                    {step.tips.map((tip, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-2 p-2.5 bg-dark-700/50 rounded-xl border border-dark-600"
                      >
                        <span className="text-lg flex-shrink-0">{tip.emoji}</span>
                        <p className="text-xs md:text-sm text-dark-300 leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Feature cards for welcome screen */}
                {step.id === 'welcome' && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: <MessageSquare className="w-4 h-4" />, label: 'AI Coach' },
                      { icon: <Sparkles className="w-4 h-4" />, label: 'Custom Plans' },
                      { icon: <Dumbbell className="w-4 h-4" />, label: 'Track Workouts' },
                      { icon: <Calendar className="w-4 h-4" />, label: 'View Progress' },
                    ].map((feature) => (
                      <div 
                        key={feature.label}
                        className="flex items-center gap-2 p-2 rounded-lg bg-dark-700/50 border border-dark-600"
                      >
                        <span className="text-genie-400">{feature.icon}</span>
                        <span className="text-xs text-dark-300">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {TOUR_STEPS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? 'bg-genie-500 w-4 md:w-6' 
                          : index < currentStep 
                            ? 'bg-genie-500/50' 
                            : 'bg-dark-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-2">
                  {!isFirstStep && (
                    <button
                      onClick={handlePrev}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white transition-colors text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    className="flex-1"
                    size="sm"
                    icon={isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  >
                    {isFirstStep ? "Let's Go!" : isLastStep ? "Get Started" : 'Next'}
                  </Button>
                </div>

                {/* Skip link */}
                {!isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="w-full mt-2 text-xs text-dark-500 hover:text-dark-400 transition-colors"
                  >
                    Skip tutorial
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export a function to reset onboarding (useful for testing or settings)
export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
}
