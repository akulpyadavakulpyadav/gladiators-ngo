import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserCircle, Phone, Globe, LogOut, ChevronDown } from 'lucide-react';

const GlobalLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Navigation Bar */}
      <nav className="glass-panel" style={{ 
        position: 'sticky', top: '1rem', zIndex: 50,
        margin: '1rem 1.5rem 0', padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
      }}>
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit', transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
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
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--color-text-primary)' }}>{user?.name}</p>
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.5rem' }}>{user?.role?.toUpperCase()}</span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
              </button>

              {showDropdown && (
                <div className="glass-card" style={{ 
                  position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0,
                  width: 180, padding: '0.5rem', zIndex: 100
                }}>
                  <button 
                    onClick={() => setShowDropdown(false)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                      padding: '0.5rem 0.75rem', border: 'none', background: 'none',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.85rem', fontFamily: 'inherit', color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <UserCircle size={16} /> Edit Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                      padding: '0.5rem 0.75rem', border: 'none', background: 'none',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.85rem', fontFamily: 'inherit', color: 'var(--color-danger)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <div style={{ 
                width: 10, height: 10, borderRadius: '50%', 
                background: 'var(--color-secondary)'
              }} className="pulse-animation" />
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>
                GladiConnect
              </span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-ghost hidden-mobile" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.04)',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem'
          }}>
            <Phone size={15} style={{ color: 'var(--color-danger)' }} className="pulse-animation" />
            <span style={{ color: 'var(--color-danger)' }}>24/7 Helpline</span>
          </button>

          <button 
            onClick={toggleLanguage} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
          >
            <Globe size={14} />
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
      <main className="container" style={{ flex: 1, padding: '2rem 1.5rem 3rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default GlobalLayout;
