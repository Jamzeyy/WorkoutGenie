import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://workoutgenie-production.up.railway.app/api';

interface SubscriptionLimits {
  monthly_workouts: number;
  daily_chat_messages: number;
  history_days: number;
  can_generate_plans: boolean;
  can_view_milestones: boolean;
  can_export: boolean;
  has_ads: boolean;
  workouts_used: number;
  chat_used: number;
}

interface SubscriptionStatus {
  tier: 'free' | 'pro';
  status: 'none' | 'active' | 'cancelled' | 'past_due';
  plan: string | null;
  ends_at: string | null;
  limits: SubscriptionLimits;
  is_pro: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  loading: boolean;
  isPro: boolean;
  limits: SubscriptionLimits | null;
  refresh: () => Promise<void>;
  canCreateWorkout: () => { allowed: boolean; message: string };
  canSendChat: () => { allowed: boolean; message: string };
  canGeneratePlan: () => { allowed: boolean; message: string };
}

const defaultLimits: SubscriptionLimits = {
  monthly_workouts: 3,
  daily_chat_messages: 5,
  history_days: 7,
  can_generate_plans: false,
  can_view_milestones: false,
  can_export: false,
  has_ads: true,
  workouts_used: 0,
  chat_used: 0,
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: true,
  isPro: false,
  limits: defaultLimits,
  refresh: async () => {},
  canCreateWorkout: () => ({ allowed: true, message: '' }),
  canSendChat: () => ({ allowed: true, message: '' }),
  canGeneratePlan: () => ({ allowed: false, message: '' }),
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSubscription() {
    if (!token) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/subscriptions/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, token]);

  const isPro = subscription?.is_pro || false;
  const limits = subscription?.limits || defaultLimits;

  function canCreateWorkout() {
    if (isPro) return { allowed: true, message: '' };
    
    const used = limits.workouts_used || 0;
    const limit = limits.monthly_workouts;
    
    if (used >= limit) {
      return {
        allowed: false,
        message: `You've used all ${limit} workouts this month. Upgrade to Pro for unlimited!`,
      };
    }
    return { allowed: true, message: '' };
  }

  function canSendChat() {
    if (isPro) return { allowed: true, message: '' };
    
    const used = limits.chat_used || 0;
    const limit = limits.daily_chat_messages;
    
    if (used >= limit) {
      return {
        allowed: false,
        message: `You've used all ${limit} messages today. Upgrade to Pro for unlimited!`,
      };
    }
    return { allowed: true, message: '' };
  }

  function canGeneratePlan() {
    if (isPro) return { allowed: true, message: '' };
    return {
      allowed: false,
      message: 'AI Plan Generation is a Pro feature. Upgrade to create personalized workout plans!',
    };
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        isPro,
        limits,
        refresh: fetchSubscription,
        canCreateWorkout,
        canSendChat,
        canGeneratePlan,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
