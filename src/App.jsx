import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import GlobalLayout from './components/GlobalLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import NgoOnboarding from './pages/ngo/NgoOnboarding';
import NgoDashboard from './pages/ngo/NgoDashboard';
import NgoProfile from './pages/ngo/NgoProfile';
import VolunteerOnboarding from './pages/volunteer/VolunteerOnboarding';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import CompanyOnboarding from './pages/company/CompanyOnboarding';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CharitySearch from './pages/company/CharitySearch';
import CompanyNgoProfile from './pages/company/CompanyNgoProfile';

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

// Auto scroll-to-top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<GlobalLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              
              {/* NGO Routes */}
              <Route path="ngo/onboarding" element={<NgoOnboarding />} />
              <Route path="ngo/dashboard/*" element={
                <ProtectedRoute allowedRole="ngo">
                  <NgoDashboard />
                </ProtectedRoute>
              } />
              <Route path="ngo/profile" element={
                <ProtectedRoute allowedRole="ngo">
                  <NgoProfile />
                </ProtectedRoute>
              } />

              {/* Volunteer Routes */}
              <Route path="volunteer/onboarding" element={<VolunteerOnboarding />} />
              <Route path="volunteer/dashboard/*" element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              } />
              <Route path="volunteer/profile" element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerProfile />
                </ProtectedRoute>
              } />

              {/* Company Routes */}
              <Route path="company/onboarding" element={<CompanyOnboarding />} />
              <Route path="company/dashboard/*" element={
                <ProtectedRoute allowedRole="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              } />
              <Route path="company/profile" element={
                <ProtectedRoute allowedRole="company">
                  <CompanyProfile />
                </ProtectedRoute>
              } />
              <Route path="company/search" element={
                <ProtectedRoute allowedRole="company">
                  <CharitySearch />
                </ProtectedRoute>
              } />
              <Route path="company/ngo/:ngoId" element={
                <ProtectedRoute allowedRole="company">
                  <CompanyNgoProfile />
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
