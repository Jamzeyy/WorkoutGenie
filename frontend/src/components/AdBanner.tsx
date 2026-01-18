import { Link } from 'react-router-dom';
import { X, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'inline';
  dismissible?: boolean;
}

export default function AdBanner({ position = 'bottom', dismissible = true }: AdBannerProps) {
  const { isPro, loading } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  // Don't show ads to Pro users or while loading
  if (isPro || loading || dismissed) {
    return null;
  }

  const messages = [
    { text: "Unlock unlimited AI workouts", icon: Sparkles },
    { text: "Get personalized fitness plans", icon: Zap },
    { text: "Train smarter with Pro", icon: Sparkles },
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const Icon = randomMessage.icon;

  if (position === 'inline') {
    return (
      <div className="bg-gradient-to-r from-genie-600/20 to-purple-600/20 border border-genie-500/30 rounded-xl p-4 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-genie-500/20 rounded-lg">
              <Icon className="w-5 h-5 text-genie-400" />
            </div>
            <div>
              <p className="text-white font-medium">{randomMessage.text}</p>
              <p className="text-dark-400 text-sm">Upgrade to Pro for the full experience</p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-2 bg-genie-500 hover:bg-genie-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed left-0 right-0 z-40 ${
        position === 'top' ? 'top-0' : 'bottom-16 md:bottom-0'
      }`}
    >
      <div className="bg-gradient-to-r from-genie-600 to-purple-600 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-medium">
              {randomMessage.text} — <span className="opacity-80">Save 50% with 2-year plan</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/pricing"
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Upgrade Now
            </Link>
            {dismissible && (
              <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
