import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Sparkles, Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/generate', icon: Sparkles, label: 'AI Generate' },
  { to: '/plans', icon: Calendar, label: 'Plans' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 glass z-50">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-genie-500 to-genie-600 flex items-center justify-center glow-effect">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-genie-500 text-white shadow-lg shadow-genie-500/30'
                    : 'text-dark-400 hover:text-genie-400 hover:bg-dark-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="absolute left-16 px-3 py-1.5 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <nav className="glass border-t border-white/10">
          <div className="flex justify-around items-center h-16 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-genie-400'
                      : 'text-dark-400'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Button (for full-screen menu if needed) */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl glass flex items-center justify-center"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 glass pt-20 pb-24"
          >
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-genie-500 to-genie-600 flex items-center justify-center glow-effect mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display gradient-text">WorkoutGenie AI</h2>
              
              <div className="w-full max-w-xs mt-8 flex flex-col gap-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-genie-500/20 text-genie-400 border border-genie-500/30'
                          : 'bg-dark-800/50 text-dark-300 hover:bg-dark-700'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
