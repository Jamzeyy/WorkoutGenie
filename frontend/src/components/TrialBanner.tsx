import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

export default function TrialBanner() {
  const { inTrial, trialDaysRemaining, isPro } = useSubscription();

  // Don't show if not in trial or if user is a paid Pro
  if (!inTrial || (isPro && !inTrial)) return null;

  // Determine urgency colors based on days remaining
  const isUrgent = trialDaysRemaining <= 2;
  const bgColor = isUrgent 
    ? 'bg-gradient-to-r from-red-600 to-orange-500' 
    : 'bg-gradient-to-r from-genie-600 to-purple-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} text-white py-3 px-4`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            {isUrgent ? (
              <Clock className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="font-semibold">
              {trialDaysRemaining === 0 
                ? '🚨 Trial ends today!' 
                : trialDaysRemaining === 1 
                  ? '⏰ 1 day left in your free trial'
                  : `✨ ${trialDaysRemaining} days left in your free trial`
              }
            </span>
            <span className="text-white/80 ml-2 hidden sm:inline">
              Enjoy unlimited Pro features!
            </span>
          </div>
        </div>
        
        <Link 
          to="/pricing"
          className="flex items-center gap-1 bg-white text-genie-600 px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
        >
          Upgrade Now
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
