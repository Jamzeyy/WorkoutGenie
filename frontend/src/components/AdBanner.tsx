import { Link } from 'react-router-dom';
import { X, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

// Google AdSense configuration
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';
const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === 'true';
const ADSENSE_SLOT_BANNER = import.meta.env.VITE_ADSENSE_SLOT_BANNER || '';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'inline';
  dismissible?: boolean;
  showGoogleAds?: boolean;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ 
  position = 'bottom', 
  dismissible = true,
  showGoogleAds = false 
}: AdBannerProps) {
  const { isPro, inTrial, loading } = useSubscription();
  const [dismissed, setDismissed] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(true);

  // Alternate between upgrade prompts and Google ads for variety
  useEffect(() => {
    // 60% chance to show upgrade prompt, 40% Google ads (when enabled)
    setShowUpgrade(Math.random() > 0.4 || !ADSENSE_ENABLED);
  }, []);

  // Pro users see nothing
  if (isPro || loading || dismissed) {
    return null;
  }

  // Trial users see subtle upgrade prompts (no Google ads during trial)
  const shouldShowGoogleAds = showGoogleAds && !inTrial && ADSENSE_ENABLED && ADSENSE_CLIENT;

  const messages = [
    { text: "Unlock unlimited AI workouts", icon: Sparkles },
    { text: "Get personalized fitness plans", icon: Zap },
    { text: "Train smarter with Pro", icon: Sparkles },
    { text: "Remove ads with Pro", icon: Sparkles },
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const Icon = randomMessage.icon;

  // Inline ad placement
  if (position === 'inline') {
    // For inline, show Google Ad if enabled and not in trial
    if (shouldShowGoogleAds && !showUpgrade) {
      return (
        <div className="my-4">
          <GoogleAdInline slot={ADSENSE_SLOT_BANNER} />
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-genie-600/20 to-purple-600/20 border border-genie-500/30 rounded-xl p-4 my-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
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

  // Bottom/top banner with Google Ads or upgrade prompt
  return (
    <div
      className={`fixed left-0 right-0 z-40 ${
        position === 'top' ? 'top-0' : 'bottom-16 md:bottom-0'
      }`}
    >
      {shouldShowGoogleAds && !showUpgrade ? (
        // Subtle Google Ad banner
        <div className="bg-dark-850/95 backdrop-blur-sm border-t border-dark-700 px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-dark-500 uppercase tracking-wider">Sponsored</p>
              {dismissible && (
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1 hover:bg-dark-700 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-dark-500" />
                </button>
              )}
            </div>
            <GoogleAdInline slot={ADSENSE_SLOT_BANNER} format="horizontal" />
          </div>
        </div>
      ) : (
        // Upgrade prompt banner
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
      )}
    </div>
  );
}

// Inline Google Ad component
function GoogleAdInline({ slot, format = 'auto' }: { slot: string; format?: 'auto' | 'horizontal' }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slot || loaded) return;

    // Load AdSense script if not already loaded
    const loadScript = () => {
      if (document.querySelector('script[src*="adsbygoogle"]')) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setLoaded(true);
        }
      })
      .catch(() => {
        console.warn('Failed to load AdSense');
      });
  }, [slot, loaded]);

  if (!slot) return null;

  return (
    <div className="flex items-center justify-center min-h-[50px] bg-dark-800/20 rounded">
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          height: format === 'horizontal' ? '50px' : 'auto'
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
