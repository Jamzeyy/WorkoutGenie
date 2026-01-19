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
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import AdBanner from './components/AdBanner';
import Footer from './components/Footer';
import TrialBanner from './components/TrialBanner';
import OnboardingTour from './components/OnboardingTour';

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
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/*"
          element={
          <ProtectedRoute>
            <SubscriptionProvider>
              <div className="min-h-screen bg-pattern">
                <TrialBanner />
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
                      <Route path="/exercises" element={<ExerciseLibrary />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                  </div>
                </main>
                <Footer />
                <AdBanner position="bottom" showGoogleAds={true} />
                <OnboardingTour />
              </div>
            </SubscriptionProvider>
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
