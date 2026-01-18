import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import AIGenerator from './pages/AIGenerator';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-pattern">
      <Navigation />
      
      <main className="md:ml-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/generate" element={<AIGenerator />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/:id" element={<PlanDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
