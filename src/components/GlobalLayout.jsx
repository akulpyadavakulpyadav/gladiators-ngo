import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserCircle, Phone, Globe, LogOut, ChevronDown } from 'lucide-react';
import { t } from '../utils/translations';

const GlobalLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
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
          onClick={() => navigate('/')}
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

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit', transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1, color: '#1E293B', margin: 0 }}>{user?.name}</p>
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: '#E2E8F0', color: '#3D5A34', alignSelf: 'flex-start' }}>{user?.role?.toUpperCase()}</span>
                </div>
                <ChevronDown size={14} style={{ color: '#475569', marginLeft: '0.2rem' }} />
              </button>

              {showDropdown && (
                <div className="glass-card" style={{
                  position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                  width: 180, padding: '0.5rem', zIndex: 100,
                  background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <button
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                      padding: '0.5rem 0.75rem', border: 'none', background: 'none',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.85rem', fontFamily: 'inherit', color: '#1E293B'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <UserCircle size={16} /> {t('edit_profile', language)}
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                      padding: '0.5rem 0.75rem', border: 'none', background: 'none',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.85rem', fontFamily: 'inherit', color: '#EF4444'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={16} /> {t('logout', language)}
                  </button>
                </div>
              )}
            </div>
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
      <main className={isLandingPage ? '' : 'container'} style={{ flex: 1, paddingTop: isLandingPage ? 0 : '5rem', paddingBottom: isLandingPage ? 0 : '1rem' }}>
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
    </div>
  );
};

export default GlobalLayout;
