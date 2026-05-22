import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserCircle, Phone, Globe, LogOut, ChevronDown, X } from 'lucide-react';
import { t } from '../utils/translations';

const taglines = {
  EN: [
    "Bridge the Gap. Amplify Impact.",
    "Unity. Purpose. Impact.",
    "Connecting Hearts, Empowering Communities.",
    "Bridging Action. Creating Change.",
    "Empowering Voices, Elevating Action."
  ],
  HI: [
    "खाई को पाटें। प्रभाव को बढ़ाएं।",
    "एकता। उद्देश्य। प्रभाव।",
    "दिलों को जोड़ना, समुदायों को सशक्त बनाना।",
    "कार्रवाई का सेतु। बदलाव का सृजन।",
    "आवाज को सशक्त बनाना, कार्रवाई को ऊंचा उठाना।"
  ],
  KN: [
    "ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡಿ. ಪ್ರಭಾವವನ್ನು ಹೆಚ್ಚಿಸಿ.",
    "ಏಕತೆ. ಉದ್ದೇಶ. ಪ್ರಭಾವ.",
    "ಹೃದಯಗಳನ್ನು ಜೋಡಿಸುವುದು, ಸಮುದಾಯಗಳನ್ನು ಸಬಲೀಕರಿಸುವುದು.",
    "ಸೇವಾ ಸೇತುವೆ. ಬದಲಾವಣೆಯ ಸೃಷ್ಟಿ.",
    "ಧ್ವನಿಗಳನ್ನು ಸಬಲೀಕರಿಸುವುದು, ಸೇವೆಯನ್ನು ಎತ್ತರಿಸುವುದು."
  ]
};

const GlobalLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  const currentLanguageTaglines = taglines[language] || taglines.EN;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentTaglineIndex((prev) => (prev + 1) % currentLanguageTaglines.length);
        setFadeState('fade-in');
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentLanguageTaglines.length]);

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}/dashboard`);
    } else {
      if (location.pathname === '/') {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="glass-panel" style={{
        position: 'fixed', top: '1rem', left: '1.5rem', right: '1.5rem', zIndex: 50,
        padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderRadius: 'var(--radius-xl)'
      }}>
        {/* Left side: Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          <img src="/images/logo.png" alt="GladiConnect Logo" style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: '50%' }} />
          <span style={{
            fontWeight: 800, fontSize: '1.15rem',
            color: '#1E293B',
            letterSpacing: '-0.01em'
          }}>
            GladiConnect
          </span>
        </div>

        {/* Middle: Creative Tagline Slider */}
        <div className="hidden-mobile" style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          pointerEvents: 'none'
        }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '0.03em',
            background: 'linear-gradient(135deg, #3D5A34, #D4A017)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            opacity: fadeState === 'fade-in' ? 1 : 0,
            transform: fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
          }}>
            "{currentLanguageTaglines[currentTaglineIndex]}"
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 38, height: 38, borderRadius: '50%',
                background: '#FEF2F2', border: '1.5px solid #FCA5A5',
                color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.15)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#EF4444';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FEF2F2';
                e.currentTarget.style.color = '#EF4444';
              }}
              title="Close & Logout"
            >
              <X size={18} />
            </button>
          )}

          <button className="btn-ghost hidden-mobile" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem',
            background: '#F8FAFC',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem'
          }}>
            <Phone size={15} style={{ color: '#4A6741' }} className="pulse-animation" />
            <span style={{ color: '#475569' }}>{t('helpline', language)}</span>
          </button>

          <button
            onClick={toggleLanguage}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 0.9rem', fontSize: '0.8rem', fontWeight: 600,
              borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              background: '#F1F5F9',
              color: '#1E293B',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Globe size={14} style={{ color: '#475569' }} />
            {language}
          </button>
        </div>
      </nav>

      {/* Click-away overlay for dropdown */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
        />
      )}

      {/* Main Content */}
      <main className={isLandingPage ? '' : 'container'} style={{ flex: 1, paddingTop: isLandingPage ? 0 : '7.5rem', paddingBottom: isLandingPage ? 0 : '1.5rem' }}>
        <Outlet />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        color: '#FFFFFF',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: 'transparent'
      }}>
        {t('made_for', language)}
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '90%', maxWidth: 400, padding: '2rem',
            textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            background: '#FFFFFF', borderRadius: '1.25rem',
            color: '#1E293B'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem', color: '#EF4444'
            }}>
              <LogOut size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem', fontFamily: 'inherit' }}>
              Confirm Logout
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Do you want to logout? Any unsaved session changes will be cleared.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn"
                style={{
                  flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569',
                  border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  navigate('/');
                }}
                className="btn"
                style={{
                  flex: 1, padding: '0.75rem', background: '#EF4444', color: '#FFFFFF',
                  borderRadius: '0.5rem', fontWeight: 700
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalLayout;
