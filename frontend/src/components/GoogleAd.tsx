import { useEffect, useRef, useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

// Google AdSense configuration from environment
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';
const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === 'true';

// Different ad slot IDs for different placements
const AD_SLOTS = {
  sidebar: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR || '',
  inline: import.meta.env.VITE_ADSENSE_SLOT_INLINE || '',
  footer: import.meta.env.VITE_ADSENSE_SLOT_FOOTER || '',
};

type AdFormat = 'horizontal' | 'vertical' | 'rectangle' | 'auto';
type AdPlacement = 'sidebar' | 'inline' | 'footer';

interface GoogleAdProps {
  placement: AdPlacement;
  format?: AdFormat;
  className?: string;
}

export default function GoogleAd({ 
  placement, 
  format = 'auto',
  className = '' 
}: GoogleAdProps) {
  const { isPro, inTrial, loading } = useSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Determine if we should show ads
  // Show ads to: free users (not in trial) 
  // Don't show ads to: Pro subscribers, trial users, or if loading
  const shouldShowAds = !isPro && !inTrial && !loading && ADSENSE_ENABLED && ADSENSE_CLIENT;

  useEffect(() => {
    if (!shouldShowAds || adLoaded) return;

    const slotId = AD_SLOTS[placement];
    if (!slotId) {
      console.warn(`No ad slot configured for placement: ${placement}`);
      return;
    }

    // Load AdSense script if not already loaded
    const loadAdSenseScript = () => {
      if (document.querySelector('script[src*="adsbygoogle"]')) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load AdSense script'));
        document.head.appendChild(script);
      });
    };

    const initAd = async () => {
      try {
        await loadAdSenseScript();
        
        // Push the ad
        if (adRef.current && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        setAdError(true);
      }
    };

    initAd();
  }, [shouldShowAds, placement, adLoaded]);

  // Don't render anything if ads shouldn't show or there's an error
  if (!shouldShowAds || adError) {
    return null;
  }

  const slotId = AD_SLOTS[placement];
  if (!slotId) {
    return null;
  }

  // Style configurations for different formats
  const formatStyles: Record<AdFormat, React.CSSProperties> = {
    horizontal: { display: 'block', width: '100%', height: '90px' },
    vertical: { display: 'block', width: '160px', height: '600px' },
    rectangle: { display: 'block', width: '300px', height: '250px' },
    auto: { display: 'block' },
  };

  // Wrapper styles for different placements
  const placementStyles: Record<AdPlacement, string> = {
    sidebar: 'hidden lg:block',
    inline: 'my-4',
    footer: 'mt-4 mb-2',
  };

  return (
    <div 
      className={`google-ad-container ${placementStyles[placement]} ${className}`}
      data-ad-placement={placement}
    >
      {/* Subtle "Advertisement" label for transparency */}
      <p className="text-[10px] text-dark-500 text-center mb-1 uppercase tracking-wider">
        Advertisement
      </p>
      
      <div 
        ref={adRef}
        className="flex items-center justify-center bg-dark-800/30 rounded-lg overflow-hidden min-h-[50px]"
      >
        <ins
          className="adsbygoogle"
          style={formatStyles[format]}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        />
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
