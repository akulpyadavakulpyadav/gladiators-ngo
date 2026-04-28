import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import GlobalLayout from './components/GlobalLayout';

// Pages
import LandingPage from './pages/LandingPage';
import NgoOnboarding from './pages/ngo/NgoOnboarding';
import NgoDashboard from './pages/ngo/NgoDashboard';
import VolunteerOnboarding from './pages/volunteer/VolunteerOnboarding';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import CompanyOnboarding from './pages/company/CompanyOnboarding';
import CompanyDashboard from './pages/company/CompanyDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="p-8 text-center">Loading session...</div>;
  
  if (!isAuthenticated) return <Navigate to="/" />;
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GlobalLayout />}>
              <Route index element={<LandingPage />} />
              
              {/* NGO Routes */}
              <Route path="ngo/onboarding" element={<NgoOnboarding />} />
              <Route path="ngo/dashboard/*" element={
                <ProtectedRoute allowedRole="ngo">
                  <NgoDashboard />
                </ProtectedRoute>
              } />

              {/* Volunteer Routes */}
              <Route path="volunteer/onboarding" element={<VolunteerOnboarding />} />
              <Route path="volunteer/dashboard/*" element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              } />

              {/* Company Routes */}
              <Route path="company/onboarding" element={<CompanyOnboarding />} />
              <Route path="company/dashboard/*" element={
                <ProtectedRoute allowedRole="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
