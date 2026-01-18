import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import AIGenerator from './pages/AIGenerator';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-genie-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
