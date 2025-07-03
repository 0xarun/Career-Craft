import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OnboardingInterests from './pages/OnboardingInterests';
import OnboardingQuestions from './pages/OnboardingQuestions';
import OnboardingPreferences from './pages/OnboardingPreferences';
import OnboardingRecommendation from './pages/OnboardingRecommendation';
import Challenge from './pages/Challenge';
import ChallengeCompleted from './pages/ChallengeCompleted';
import FinalMatch from './pages/FinalMatch';
import Admin from './pages/Admin';
import { useAuth } from './contexts/AuthContext';
import LearningPage from './components/LearningPage';

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/interests"
            element={
              <ProtectedRoute>
                <OnboardingInterests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/questions"
            element={
              <ProtectedRoute>
                <OnboardingQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/preferences"
            element={
              <ProtectedRoute>
                <OnboardingPreferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/recommendation"
            element={
              <ProtectedRoute>
                <OnboardingRecommendation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/:trackId/:day"
            element={
              <ProtectedRoute>
                <Challenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenge-completed/:careerId/:day"
            element={
              <ProtectedRoute>
                <ChallengeCompleted />
              </ProtectedRoute>
            }
          />
          <Route
            path="/final-match"
            element={
              <ProtectedRoute>
                <FinalMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-paths/:slug/page-1"
            element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes; 