import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Sparkles, ChevronRight, Trash2, 
  ToggleLeft, ToggleRight, Clock, Plus 
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import AdBanner from '../components/AdBanner';
import { plansApi } from '../api';
import { WorkoutPlan } from '../types';
import { format } from 'date-fns';

export default function Plans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const data = await plansApi.getAll();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await plansApi.toggleActive(id);
      setPlans(plans.map(p => 
        p.id === id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (error) {
      console.error('Failed to toggle plan:', error);
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await plansApi.delete(id);
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading plans..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-white tracking-wide">WORKOUT PLANS</h1>
          <p className="text-dark-400 mt-1">Your AI-generated workout programs</p>
        </div>
        <Link to="/generate">
          <Button icon={<Sparkles className="w-5 h-5" />}>
            Generate New
          </Button>
        </Link>
      </div>

      {/* Plans List */}
      {plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <Link key={plan.id} to={`/plans/${plan.id}`}>
              <Card delay={index * 0.05} className="group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      plan.is_active 
                        ? 'bg-gradient-to-br from-genie-500 to-emerald-500' 
                        : 'bg-dark-700'
                    }`}>
                      <Calendar className={`w-7 h-7 ${plan.is_active ? 'text-white' : 'text-dark-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white group-hover:text-genie-400 transition-colors">
                          {plan.name}
                        </p>
                        {plan.is_active && (
                          <span className="px-2 py-0.5 rounded-full bg-genie-500/20 text-genie-400 text-xs font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-dark-400 mt-1 line-clamp-2">{plan.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-dark-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {plan.cycle_type} ({plan.cycle_weeks} week{plan.cycle_weeks > 1 ? 's' : ''})
                        </span>
                        <span>
                          Created {format(new Date(plan.created_at!), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleActive(plan.id!, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        plan.is_active 
                          ? 'text-genie-400 hover:bg-genie-500/10' 
                          : 'text-dark-500 hover:text-dark-300 hover:bg-dark-700'
                      }`}
                      title={plan.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {plan.is_active ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(plan.id!, e)}
                      className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          
          {/* Subtle inline ad for free users */}
          <AdBanner position="inline" showGoogleAds={true} />
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-genie-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-genie-400" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No Plans Yet</h3>
            <p className="text-dark-400 mb-6">Let our AI create a personalized workout plan for you</p>
            <Link to="/generate">
              <Button icon={<Plus className="w-5 h-5" />}>
                Generate Your First Plan
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
