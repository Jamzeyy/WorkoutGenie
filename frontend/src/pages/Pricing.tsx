import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, X, Sparkles, Zap, Crown, ChevronRight,
  Dumbbell, MessageSquare, Calendar, Trophy, Download, Ban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

// Paddle will be loaded via script tag
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: string) => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: { priceId: string; quantity: number }[];
          customer?: { email: string };
          customData?: Record<string, string>;
          successUrl?: string;
        }) => void;
      };
    };
  }
}

const PADDLE_CLIENT_TOKEN = import.meta.env.VITE_PADDLE_CLIENT_TOKEN || '';
const PADDLE_PRICE_MONTHLY = import.meta.env.VITE_PADDLE_PRICE_MONTHLY || '';
const PADDLE_PRICE_ANNUAL = import.meta.env.VITE_PADDLE_PRICE_ANNUAL || '';
const PADDLE_PRICE_TWO_YEAR = import.meta.env.VITE_PADDLE_PRICE_TWO_YEAR || '';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    period: '/month',
    priceId: PADDLE_PRICE_MONTHLY,
    popular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 71.88,
    monthlyPrice: 5.99,
    period: '/year',
    discount: 40,
    priceId: PADDLE_PRICE_ANNUAL,
    popular: true,
  },
  {
    id: 'two_year',
    name: '2 Year',
    price: 119.76,
    monthlyPrice: 4.99,
    period: '/2 years',
    discount: 50,
    priceId: PADDLE_PRICE_TWO_YEAR,
    popular: false,
  },
];

const features = [
  { name: 'Track Workouts', free: '3/month', pro: 'Unlimited', icon: Dumbbell },
  { name: 'AI Plan Generation', free: false, pro: true, icon: Sparkles },
  { name: 'AI Chat (Genie)', free: '5/day', pro: 'Unlimited', icon: MessageSquare },
  { name: 'Workout History', free: '7 days', pro: 'Full', icon: Calendar },
  { name: 'Milestones & Achievements', free: false, pro: true, icon: Trophy },
  { name: 'Export Data', free: false, pro: true, icon: Download },
  { name: 'Ads', free: true, pro: false, icon: Ban, inverted: true },
];

export default function Pricing() {
  const { user } = useAuth();
  const [selectedPlan] = useState('annual');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Paddle.js
    if (!window.Paddle && PADDLE_CLIENT_TOKEN) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          // Use sandbox for development
          if (import.meta.env.DEV) {
            window.Paddle.Environment.set('sandbox');
          }
          window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  function handleSubscribe(planId: string) {
    const plan = plans.find(p => p.id === planId);
    if (!plan?.priceId || !window.Paddle) {
      console.error('Paddle not initialized or missing price ID');
      return;
    }

    setLoading(true);
    
    window.Paddle.Checkout.open({
      items: [{ priceId: plan.priceId, quantity: 1 }],
      customer: user?.email ? { email: user.email } : undefined,
      customData: { userId: String(user?.id || '') },
      successUrl: `${window.location.origin}/profile?subscription=success`,
    });

    // Paddle handles the rest
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-genie-500/20 rounded-full text-genie-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          Upgrade to Pro
        </div>
        <h1 className="text-3xl md:text-4xl font-display text-white mb-4">
          Unlock Your Full Potential
        </h1>
        <p className="text-dark-400 max-w-xl mx-auto">
          Get unlimited AI-powered workout plans, chat with the Genie anytime, 
          and track your entire fitness journey without limits.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl p-6 ${
              plan.popular
                ? 'bg-gradient-to-b from-genie-500/20 to-dark-800 border-2 border-genie-500'
                : 'bg-dark-800/50 border border-dark-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-genie-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
              
              {plan.discount && (
                <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded mb-2">
                  Save {plan.discount}%
                </span>
              )}
              
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">${plan.monthlyPrice || plan.price}</span>
                <span className="text-dark-400">{plan.monthlyPrice ? '/mo' : plan.period}</span>
              </div>
              
              {plan.monthlyPrice && (
                <p className="text-sm text-dark-500 mt-1">
                  ${plan.price} billed {plan.id === 'annual' ? 'annually' : 'every 2 years'}
                </p>
              )}
            </div>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              loading={loading && selectedPlan === plan.id}
              className={`w-full ${
                plan.popular
                  ? 'bg-genie-500 hover:bg-genie-600'
                  : 'bg-dark-700 hover:bg-dark-600'
              }`}
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">Compare Plans</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left p-4 text-dark-400 font-medium">Feature</th>
                <th className="text-center p-4 text-dark-400 font-medium w-32">Free</th>
                <th className="text-center p-4 font-medium w-32">
                  <span className="flex items-center justify-center gap-1 text-genie-400">
                    <Crown className="w-4 h-4" />
                    Pro
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-dark-700/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-dark-400" />
                      <span className="text-white">{feature.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {feature.inverted ? (
                      feature.free ? (
                        <span className="text-dark-400">Yes</span>
                      ) : (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      )
                    ) : typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-dark-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-dark-400">{feature.free}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {feature.inverted ? (
                      feature.pro ? (
                        <span className="text-dark-400">Yes</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">No Ads</span>
                      )
                    ) : typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-dark-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-genie-400 font-medium">{feature.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ or Trust badges could go here */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 text-dark-500 text-sm"
      >
        <p>Secure payment powered by Paddle. Cancel anytime.</p>
      </motion.div>
    </div>
  );
}
