import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dumbbell, Calendar, TrendingUp, ChevronRight, Flame, Send, Bot, User } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import AdBanner from '../components/AdBanner';
import { workoutsApi, plansApi, chatApi, ChatMessage } from '../api';
import { Workout, WorkoutPlan } from '../types';
import { format } from 'date-fns';

const QUICK_PROMPTS = [
  "What's a good warm-up routine?",
  "Explain myoreps",
  "Tips for better form",
  "How much protein daily?",
];

export default function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [activePlans, setActivePlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! I'm WorkoutGenie 💪 Ask me anything about fitness, exercises, nutrition, or your workout routine!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Handle mobile keyboard open/close
  useEffect(() => {
    const handleViewportResize = () => {
      if (!window.visualViewport) return;
      
      // Detect if keyboard is open by comparing viewport height to window height
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const isKeyboard = windowHeight - viewportHeight > 150;
      
      setKeyboardOpen(isKeyboard);
      
      if (isKeyboard && inputContainerRef.current) {
        // Keyboard opened - scroll input into view with smooth behavior
        setTimeout(() => {
          inputContainerRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end'
          });
        }, 100);
      } else if (!isKeyboard && chatContainerRef.current) {
        // Keyboard closed - scroll to show the full chat from the top
        setTimeout(() => {
          chatContainerRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }, 100);
      }
    };

    // Listen to visualViewport changes (mobile keyboard detection)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  // Handle input focus - ensure input is visible on mobile
  const handleInputFocus = () => {
    // Small delay to wait for keyboard to appear
    setTimeout(() => {
      inputContainerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end'
      });
    }, 300);
  };

  // Handle input blur - scroll back to show full chat
  const handleInputBlur = () => {
    // Small delay to ensure keyboard is closing
    setTimeout(() => {
      if (!keyboardOpen) {
        chatContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 150);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [workouts, plans] = await Promise.all([
          workoutsApi.getAll(),
          plansApi.getActive(),
        ]);
        setRecentWorkouts(workouts.slice(0, 3));
        setActivePlans(plans.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Scroll to bottom of messages area when new messages arrive (only after user interaction)
  // This scrolls WITHIN the chat container, not the whole page
  useEffect(() => {
    if (hasInteracted && messagesAreaRef.current) {
      // Scroll within the messages container only
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages, hasInteracted]);

  async function handleSendMessage(text?: string) {
    const messageText = text || inputValue.trim();
    if (!messageText || isSending) return;

    setHasInteracted(true);
    const userMessage: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await chatApi.send([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now. Please try again! 🔄" 
      }]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const stats = [
    { label: 'Workouts This Week', value: recentWorkouts.length, icon: Dumbbell, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Plans', value: activePlans.length, icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Current Streak', value: '3 days', icon: Flame, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-8">
      {/* AI Chat Section */}
      <motion.div
        ref={chatContainerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-genie-600 via-genie-500 to-emerald-400 p-1"
      >
        <div className="bg-dark-900/95 backdrop-blur rounded-[22px] overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-dark-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-genie-500 to-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-white tracking-wide">WORKOUTGENIE</h2>
              <p className="text-xs text-genie-400">Your AI Fitness Coach • Online</p>
            </div>
            <div className="ml-auto">
              <Link to="/generate">
                <Button size="sm" icon={<Sparkles className="w-4 h-4" />}>
                  Generate Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesAreaRef} className="h-64 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-dark-600">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-blue-500/20' 
                      : 'bg-genie-500/20'
                  }`}>
                    {msg.role === 'user' 
                      ? <User className="w-4 h-4 text-blue-400" />
                      : <Bot className="w-4 h-4 text-genie-400" />
                    }
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-500/20 text-white rounded-tr-sm'
                      : 'bg-dark-700/70 text-dark-200 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing indicator */}
            {isSending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-genie-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-genie-400" />
                </div>
                <div className="bg-dark-700/70 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-genie-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-genie-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-genie-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-dark-700/50 hover:bg-dark-600/50 text-dark-300 hover:text-white rounded-full transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div ref={inputContainerRef} className="p-4 pt-2 border-t border-dark-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask me anything about fitness..."
                disabled={isSending}
                className="flex-1 px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:border-genie-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isSending}
                className="px-4 py-3 bg-gradient-to-r from-genie-500 to-emerald-500 rounded-xl text-white font-medium hover:from-genie-400 hover:to-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} delay={index * 0.1} className="text-center">
            <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs md:text-sm text-dark-400 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/workouts">
          <Card className="group" delay={0.2}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-genie-500/20 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-genie-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Log Workout</p>
                  <p className="text-xs text-dark-400">Track your exercises</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
            </div>
          </Card>
        </Link>
        
        <Link to="/plans">
          <Card className="group" delay={0.3}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">View Plans</p>
                  <p className="text-xs text-dark-400">Your workout schedule</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-purple-400 transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Workouts</h2>
          <Link to="/workouts" className="text-sm text-genie-400 hover:text-genie-300">
            View All
          </Link>
        </div>
        
        {loading ? (
          <Card>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-dark-700 rounded w-3/4" />
              <div className="h-4 bg-dark-700 rounded w-1/2" />
            </div>
          </Card>
        ) : recentWorkouts.length > 0 ? (
          <div className="space-y-3">
            {recentWorkouts.map((workout, index) => (
              <Link key={workout.id} to={`/workouts/${workout.id}`}>
                <Card delay={0.4 + index * 0.1} className="group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white group-hover:text-genie-400 transition-colors">
                        {workout.name}
                      </p>
                      <p className="text-sm text-dark-400">
                        {format(new Date(workout.date), 'MMM d, yyyy')} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-6">
              <Dumbbell className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No workouts yet</p>
              <Link to="/workouts" className="text-genie-400 text-sm hover:underline">
                Start your first workout
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Subtle inline ad for free users */}
      <AdBanner position="inline" showGoogleAds={true} />

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Active Plans</h2>
            <Link to="/plans" className="text-sm text-genie-400 hover:text-genie-300">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {activePlans.map((plan, index) => (
              <Link key={plan.id} to={`/plans/${plan.id}`}>
                <Card delay={0.5 + index * 0.1} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-genie-500 to-emerald-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-genie-400 transition-colors">
                          {plan.name}
                        </p>
                        <p className="text-sm text-dark-400">
                          {plan.cycle_type} • {plan.cycle_weeks} week(s)
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-genie-400 transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
