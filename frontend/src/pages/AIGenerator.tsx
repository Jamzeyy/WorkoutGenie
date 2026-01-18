import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, 
  Dumbbell, Target, Clock, Calendar, Zap, 
  Heart, AlertCircle, MessageSquare, Save, Crown, Lock
} from 'lucide-react';
import posthog from 'posthog-js';
import Card from '../components/Card';
import Button from '../components/Button';
import { plansApi } from '../api';
import { QuestionnaireData, GeneratePlanResponse } from '../types';
import { useSubscription } from '../context/SubscriptionContext';

const STEPS = [
  { id: 'fitness_level', title: 'Fitness Level', icon: Zap },
  { id: 'goal', title: 'Your Goal', icon: Target },
  { id: 'schedule', title: 'Schedule', icon: Calendar },
  { id: 'equipment', title: 'Equipment', icon: Dumbbell },
  { id: 'focus', title: 'Focus Areas', icon: Heart },
  { id: 'limitations', title: 'Limitations', icon: AlertCircle },
  { id: 'extra', title: 'Extra Comments', icon: MessageSquare },
  { id: 'cycle', title: 'Plan Duration', icon: Clock },
];

const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'New to working out or returning after a long break' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Consistent training for 6+ months' },
  { value: 'advanced', label: 'Advanced', desc: '2+ years of dedicated training' },
];

const GOALS = [
  { value: 'strength', label: 'Build Strength', desc: 'Increase overall power and lift heavier' },
  { value: 'muscle_building', label: 'Build Muscle', desc: 'Hypertrophy and muscle definition' },
  { value: 'weight_loss', label: 'Lose Weight', desc: 'Burn fat and improve body composition' },
  { value: 'endurance', label: 'Improve Endurance', desc: 'Better stamina and cardiovascular health' },
  { value: 'general_fitness', label: 'General Fitness', desc: 'Overall health and well-being' },
];

const EQUIPMENT_OPTIONS = [
  'Bodyweight Only', 'Dumbbells', 'Barbell', 'Kettlebells', 
  'Resistance Bands', 'Pull-up Bar', 'Bench', 'Cable Machine',
  'Full Gym Access', 'Cardio Machines'
];

const FOCUS_AREAS = [
  'Full Body', 'Upper Body', 'Lower Body', 'Core/Abs',
  'Back', 'Chest', 'Shoulders', 'Arms', 'Glutes', 'Legs'
];

const CYCLE_TYPES = [
  { value: 'weekly', label: '1 Week', desc: 'Quick intro or test week' },
  { value: 'monthly', label: '4 Weeks', desc: 'Standard training block' },
  { value: 'bi-monthly', label: '8 Weeks', desc: 'Full progression cycle' },
];

export default function AIGenerator() {
  const navigate = useNavigate();
  const { canGeneratePlan } = useSubscription();
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  
  // Check if user can generate plans
  const planAccess = canGeneratePlan();
  
  if (!planAccess.allowed) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-genie-500/20 to-purple-500/20 flex items-center justify-center">
            <Lock className="w-10 h-10 text-genie-400" />
          </div>
          <h1 className="text-2xl font-display text-white mb-3">Pro Feature</h1>
          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            {planAccess.message}
          </p>
          <Link to="/pricing">
            <Button className="bg-gradient-to-r from-genie-500 to-purple-500">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>
          
          <div className="mt-12 p-6 bg-dark-800/50 border border-dark-700 rounded-2xl text-left">
            <h3 className="text-lg font-semibold text-white mb-4">What you'll get with Pro:</h3>
            <ul className="space-y-3 text-dark-300">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                Unlimited AI-generated workout plans
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                Personalized based on your body stats
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                Weekly, monthly, and 8-week programs
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400" />
                Progressive overload built in
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }
  const [generatedPlan, setGeneratedPlan] = useState<GeneratePlanResponse | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<QuestionnaireData & { cycle_type: string }>({
    fitness_level: 'intermediate',
    primary_goal: 'general_fitness',
    workout_days_per_week: 3,
    workout_duration_minutes: 45,
    available_equipment: ['Bodyweight Only'],
    focus_areas: ['Full Body'],
    injuries_limitations: '',
    extra_comments: '',
    cycle_type: 'monthly',
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  }

  async function handleGenerate() {
    setGenerating(true);
    posthog.capture('plan_generation_started', {
      cycle_type: formData.cycle_type,
      fitness_level: formData.fitness_level,
      goal: formData.primary_goal,
    });
    try {
      const { cycle_type, ...questionnaireData } = formData;
      const result = await plansApi.generate(questionnaireData as QuestionnaireData, cycle_type);
      setGeneratedPlan(result);
      posthog.capture('plan_generation_completed', {
        cycle_type: formData.cycle_type,
        plan_name: result.plan_name,
      });
    } catch (error) {
      console.error('Failed to generate plan:', error);
      posthog.capture('plan_generation_failed', { error: String(error) });
      alert('Failed to generate plan. Please check your API key and try again.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSavePlan() {
    if (!generatedPlan) return;
    
    setSaving(true);
    try {
      const { cycle_type, ...questionnaireData } = formData;
      await plansApi.save({
        name: generatedPlan.plan_name,
        description: generatedPlan.plan_description,
        cycle_type: generatedPlan.cycle_type,
        questionnaire_data: questionnaireData as QuestionnaireData,
        plan_data: generatedPlan.plan_data,
      });
      posthog.capture('plan_saved', {
        plan_name: generatedPlan.plan_name,
        cycle_type: generatedPlan.cycle_type,
      });
      navigate('/plans');
    } catch (error) {
      console.error('Failed to save plan:', error);
      posthog.capture('plan_save_failed', { error: String(error) });
      alert('Failed to save plan. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // If generating, show loading
  if (generating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-dark-700" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-genie-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-genie-400" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-2xl font-display text-white mb-2">GENERATING YOUR PLAN</h2>
          <p className="text-dark-400">Our AI is crafting a personalized workout plan just for you...</p>
          
          <div className="mt-8 space-y-2 text-sm text-dark-500">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Analyzing your fitness level...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Selecting optimal exercises...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              Building progressive structure...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  // If plan generated, show preview
  if (generatedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display text-white tracking-wide">YOUR AI PLAN</h1>
            <p className="text-dark-400 mt-1">Review and save your personalized workout plan</p>
          </div>
        </div>

        {/* Plan Overview */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-genie-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{generatedPlan.plan_name}</h2>
              <p className="text-dark-400 mt-1">{generatedPlan.plan_description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-genie-500/20 text-genie-400">
                  {generatedPlan.cycle_type}
                </span>
                <span className="text-dark-400">
                  {generatedPlan.cycle_weeks} week(s)
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Schedule Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Schedule Preview</h3>
          
          {generatedPlan.plan_data.weekly_schedule?.slice(0, 1).map((week) => (
            <div key={week.week_number} className="space-y-3">
              <p className="text-sm text-dark-400">Week {week.week_number}: {week.theme}</p>
              
              {week.days.map((day, index) => (
                <Card key={index} delay={index * 0.05} animate={false}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-genie-400">{day.day_name.slice(0, 3)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{day.workout_name}</p>
                      <p className="text-sm text-dark-400">{day.focus} • {day.duration_minutes} min</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {day.exercises.slice(0, 3).map((exercise, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 bg-dark-800/50 rounded-lg">
                        <span className="text-sm text-dark-300">{exercise.name}</span>
                        <span className="text-sm text-dark-500">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                    ))}
                    {day.exercises.length > 3 && (
                      <p className="text-xs text-dark-500 text-center py-1">
                        +{day.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Tips */}
        {generatedPlan.plan_data.tips && generatedPlan.plan_data.tips.length > 0 && (
          <Card>
            <h3 className="font-semibold text-white mb-3">Tips for Success</h3>
            <ul className="space-y-2">
              {generatedPlan.plan_data.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-dark-300">
                  <Check className="w-4 h-4 text-genie-400 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setGeneratedPlan(null);
              setCurrentStep(0);
            }}
          >
            Start Over
          </Button>
          <Button
            className="flex-1"
            onClick={handleSavePlan}
            loading={saving}
            icon={<Save className="w-5 h-5" />}
          >
            Save Plan
          </Button>
        </div>
      </div>
    );
  }

  // Questionnaire Steps
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display text-white tracking-wide">AI WORKOUT GENERATOR</h1>
        <p className="text-dark-400 mt-1">Answer a few questions to get your personalized plan</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-400">Step {currentStep + 1} of {STEPS.length}</span>
          <span className="text-genie-400">{STEPS[currentStep].title}</span>
        </div>
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-genie-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card animate={false}>
            {/* Step 1: Fitness Level */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-genie-500/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-genie-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">What's your fitness level?</h2>
                    <p className="text-sm text-dark-400">This helps us calibrate exercise intensity</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {FITNESS_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFormData({ ...formData, fitness_level: level.value as QuestionnaireData['fitness_level'] })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.fitness_level === level.value
                          ? 'border-genie-500 bg-genie-500/10'
                          : 'border-dark-700 hover:border-dark-600'
                      }`}
                    >
                      <p className="font-medium text-white">{level.label}</p>
                      <p className="text-sm text-dark-400 mt-1">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Goal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">What's your primary goal?</h2>
                    <p className="text-sm text-dark-400">We'll optimize your plan accordingly</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => setFormData({ ...formData, primary_goal: goal.value as QuestionnaireData['primary_goal'] })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.primary_goal === goal.value
                          ? 'border-genie-500 bg-genie-500/10'
                          : 'border-dark-700 hover:border-dark-600'
                      }`}
                    >
                      <p className="font-medium text-white">{goal.label}</p>
                      <p className="text-sm text-dark-400 mt-1">{goal.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Your workout schedule</h2>
                    <p className="text-sm text-dark-400">How often and how long can you train?</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-3">
                    Days per week: <span className="text-genie-400">{formData.workout_days_per_week}</span>
                  </label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map((days) => (
                      <button
                        key={days}
                        onClick={() => setFormData({ ...formData, workout_days_per_week: days })}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          formData.workout_days_per_week === days
                            ? 'bg-genie-500 text-white'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-3">
                    Workout duration: <span className="text-genie-400">{formData.workout_duration_minutes} min</span>
                  </label>
                  <div className="flex gap-2">
                    {[30, 45, 60, 75, 90].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setFormData({ ...formData, workout_duration_minutes: mins })}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          formData.workout_duration_minutes === mins
                            ? 'bg-genie-500 text-white'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        {mins}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Equipment */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Available equipment</h2>
                    <p className="text-sm text-dark-400">Select all that you have access to</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_OPTIONS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setFormData({ 
                        ...formData, 
                        available_equipment: toggleArrayItem(formData.available_equipment, item)
                      })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.available_equipment.includes(item)
                          ? 'bg-genie-500 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Focus Areas */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Focus areas</h2>
                    <p className="text-sm text-dark-400">Which areas do you want to emphasize?</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => setFormData({ 
                        ...formData, 
                        focus_areas: toggleArrayItem(formData.focus_areas, area)
                      })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.focus_areas.includes(area)
                          ? 'bg-genie-500 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Limitations */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Any injuries or limitations?</h2>
                    <p className="text-sm text-dark-400">We'll avoid exercises that may cause issues</p>
                  </div>
                </div>
                
                <textarea
                  value={formData.injuries_limitations}
                  onChange={(e) => setFormData({ ...formData, injuries_limitations: e.target.value })}
                  placeholder="e.g., Bad lower back, recovering from knee surgery, limited shoulder mobility..."
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 resize-none focus:border-genie-500"
                />
                <p className="text-xs text-dark-500">Leave blank if none</p>
              </div>
            )}

            {/* Step 7: Extra Comments */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Anything else to add?</h2>
                    <p className="text-sm text-dark-400">Share any preferences or details we should know</p>
                  </div>
                </div>
                
                <textarea
                  value={formData.extra_comments}
                  onChange={(e) => setFormData({ ...formData, extra_comments: e.target.value })}
                  placeholder="e.g., I prefer compound movements, I want to include HIIT, I have limited time in the morning, I enjoy supersets..."
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 resize-none focus:border-genie-500"
                />
              </div>
            )}

            {/* Step 8: Cycle Type */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Plan duration</h2>
                    <p className="text-sm text-dark-400">How long should your training cycle be?</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {CYCLE_TYPES.map((cycle) => (
                    <button
                      key={cycle.value}
                      onClick={() => setFormData({ ...formData, cycle_type: cycle.value })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.cycle_type === cycle.value
                          ? 'border-genie-500 bg-genie-500/10'
                          : 'border-dark-700 hover:border-dark-600'
                      }`}
                    >
                      <p className="font-medium text-white">{cycle.label}</p>
                      <p className="text-sm text-dark-400 mt-1">{cycle.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={prevStep} icon={<ChevronLeft className="w-5 h-5" />}>
            Back
          </Button>
        )}
        
        <div className="flex-1" />
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={nextStep} icon={<ChevronRight className="w-5 h-5" />} className="flex-row-reverse">
            Next
          </Button>
        ) : (
          <Button onClick={handleGenerate} icon={<Sparkles className="w-5 h-5" />}>
            Generate Plan
          </Button>
        )}
      </div>
    </div>
  );
}
