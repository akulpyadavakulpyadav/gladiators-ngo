import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  UserCircle, Phone, Globe, LogOut, ChevronDown, X, Heart, Building2,
  Briefcase, ShieldCheck, Check, Edit3, Save, User, MapPin, Hash, UserCheck, Trash2
} from 'lucide-react';
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
  const { user, logout, isAuthenticated, updateUserProfile } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [interestInput, setInterestInput] = useState('');
  const [csrFocusInput, setCsrFocusInput] = useState('');

  React.useEffect(() => {
    if (user) {
      setEditFormData({ ...user });
    }
  }, [user, showEditProfileModal]);

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

      {/* Left-Side Profile Widget */}
      {isAuthenticated && user && !isLandingPage && (
        <div style={{ position: 'fixed', left: '1.5rem', top: '7.5rem', zIndex: 900 }}>
          {/* Floating profile avatar with verified badge beside it */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4A6741, #3D5A34)',
                border: '2px solid #FFFFFF', color: '#FFFFFF',
                fontSize: '1.25rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              title="View Profile Details"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              {/* Tiny check mark badge overlay on bottom right */}
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                background: '#10B981', border: '2px solid #FFFFFF',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Check size={10} strokeWidth={3} />
              </div>
            </button>

            {/* Verified badge beside the profile icon */}
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {(() => {
                const logoSize = 16;
                const iconSize = 12;
                const padding = '0.25rem 0.6rem';
                const fontSize = '0.75rem';

                if (user.role === 'volunteer') {
                  return (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                      background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                      border: '1px solid #81C784', color: '#2E7D32',
                      boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)'
                    }}>
                      <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                      <Heart size={iconSize} fill="#2E7D32" />
                      <span>GC-VLT Verified</span>
                    </div>
                  );
                }
                if (user.role === 'ngo') {
                  return (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                      background: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
                      border: '1px solid #4DB6AC', color: '#00695C',
                      boxShadow: '0 2px 4px rgba(0, 105, 92, 0.1)'
                    }}>
                      <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                      <Building2 size={iconSize} />
                      <span>GC-NGO Verified</span>
                    </div>
                  );
                }
                if (user.role === 'company') {
                  return (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                      background: 'linear-gradient(135deg, #FFF9C4, #FFF59D)',
                      border: '1px solid #FBC02D', color: '#F57F17',
                      boxShadow: '0 2px 4px rgba(245, 127, 23, 0.1)'
                    }}>
                      <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                      <Briefcase size={iconSize} />
                      <span>GC-CPY Verified</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Dropdown panel */}
          {showProfileDropdown && (
            <>
              {/* Click away layer */}
              <div 
                onClick={() => setShowProfileDropdown(false)} 
                style={{ position: 'fixed', inset: 0, zIndex: 899, background: 'transparent' }} 
              />
              <div className="glass-card animate-fade-in" style={{
                position: 'absolute', left: 0, top: '3.75rem', zIndex: 900,
                width: 320, padding: '1.5rem',
                background: '#FFFFFF',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
                borderRadius: '1.25rem'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4A6741, #3D5A34)',
                    color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '0.75rem', border: '3px solid #E2E8F0'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>{user.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginTop: '0.15rem' }}>
                    ID: {user.gcId}
                  </div>
                  <div style={{ marginTop: '0.6rem' }}>
                    {(() => {
                      const logoSize = 22;
                      const iconSize = 15;
                      const padding = '0.4rem 0.8rem';
                      const fontSize = '0.8rem';

                      if (user.role === 'volunteer') {
                        return (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                            background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                            border: '1px solid #81C784', color: '#2E7D32',
                            boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)'
                          }}>
                            <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                            <Heart size={iconSize} fill="#2E7D32" />
                            <span>GC-VLT Verified</span>
                          </div>
                        );
                      }
                      if (user.role === 'ngo') {
                        return (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                            background: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
                            border: '1px solid #4DB6AC', color: '#00695C',
                            boxShadow: '0 2px 4px rgba(0, 105, 92, 0.1)'
                          }}>
                            <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                            <Building2 size={iconSize} />
                            <span>GC-NGO Verified</span>
                          </div>
                        );
                      }
                      if (user.role === 'company') {
                        return (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding, fontSize, fontWeight: 700, borderRadius: '2rem',
                            background: 'linear-gradient(135deg, #FFF9C4, #FFF59D)',
                            border: '1px solid #FBC02D', color: '#F57F17',
                            boxShadow: '0 2px 4px rgba(245, 127, 23, 0.1)'
                          }}>
                            <img src="/images/logo.png" alt="" style={{ width: logoSize, height: logoSize, borderRadius: '50%' }} />
                            <Briefcase size={iconSize} />
                            <span>GC-CPY Verified</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '0.75rem 0' }} />

                {/* User Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
                  {user.role === 'volunteer' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> <span>{user.location || 'Bangalore'}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> <span>Age: {user.age}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> <span>{user.phone}</span></div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '0.25rem' }}>Interests:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {user.interests?.map((interest, i) => (
                            <span key={i} style={{ background: '#F1F5F9', color: '#475569', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>{interest}</span>
                          )) || <span style={{ fontStyle: 'italic' }}>None specified</span>}
                        </div>
                      </div>
                    </>
                  )}
                  {user.role === 'ngo' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> <span>HQ: {user.headquarters || 'Bangalore'}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} /> <a href={user.website} target="_blank" rel="noreferrer" style={{ color: '#3D5A34', textDecoration: 'none', fontWeight: 600 }}>{user.website ? user.website.replace(/^https?:\/\//, '') : 'Website'}</a></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> <span>POC: {user.pocName} ({user.pocDesignation})</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> <span>{user.pocPhone}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Hash size={14} /> <span style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>Darpan ID: {user.ngoDarpanId}</span></div>
                    </>
                  )}
                  {user.role === 'company' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> <span>HQ: {user.headquarters || 'Mumbai'}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} /> <a href={user.website} target="_blank" rel="noreferrer" style={{ color: '#3D5A34', textDecoration: 'none', fontWeight: 600 }}>{user.website ? user.website.replace(/^https?:\/\//, '') : 'Website'}</a></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> <span>POC: {user.pocName} ({user.pocDesignation})</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> <span>{user.pocPhone}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Hash size={14} /> <span style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>CIN: {user.cin}</span></div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155', marginBottom: '0.25rem' }}>Preferred CSR Focus:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {user.csrFocus?.map((focus, i) => (
                            <span key={i} style={{ background: '#FFF9C4', color: '#F57F17', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>{focus}</span>
                          )) || <span style={{ fontStyle: 'italic' }}>None specified</span>}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowEditProfileModal(true);
                    }}
                    style={{
                      width: '100%', padding: '0.6rem', background: '#F1F5F9', color: '#334155',
                      border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700,
                      fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <Edit3 size={15} /> Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowLogoutConfirm(true);
                    }}
                    style={{
                      width: '100%', padding: '0.6rem', background: '#FEF2F2', color: '#EF4444',
                      border: '1px solid #FCA5A5', borderRadius: '0.5rem', fontWeight: 700,
                      fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '90%', maxWidth: 500, padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            background: '#FFFFFF', borderRadius: '1.25rem',
            color: '#1E293B', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Edit3 size={20} style={{ color: '#4A6741' }} /> Edit Profile Details
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              updateUserProfile(editFormData);
              setShowEditProfileModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Common fields based on role */}
              {editFormData.role === 'volunteer' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Name as per records</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Phone Number</label>
                      <input
                        type="text"
                        required
                        value={editFormData.phone || ''}
                        onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Age</label>
                      <input
                        type="number"
                        required
                        value={editFormData.age || ''}
                        onChange={e => setEditFormData({ ...editFormData, age: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Email</label>
                      <input
                        type="email"
                        required
                        value={editFormData.email || ''}
                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Location</label>
                      <input
                        type="text"
                        required
                        value={editFormData.location || ''}
                        onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Volunteer Tag Interests */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Primary Interests</label>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
                      border: '1px solid #E2E8F0', padding: '0.5rem',
                      borderRadius: '0.375rem', minHeight: '45px', background: '#F8FAFC',
                      alignItems: 'center'
                    }}>
                      {editFormData.interests && editFormData.interests.length > 0 ? (
                        editFormData.interests.map((interest, idx) => (
                          <span key={idx} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            background: '#E2E8F0', color: '#334155', padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600
                          }}>
                            {interest}
                            <button
                              type="button"
                              onClick={() => {
                                setEditFormData(prev => ({
                                  ...prev,
                                  interests: prev.interests.filter(item => item !== interest)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No interests selected yet</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Add an interest..."
                        value={interestInput}
                        onChange={e => setInterestInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (interestInput.trim() && !editFormData.interests?.includes(interestInput.trim())) {
                              setEditFormData(prev => ({
                                ...prev,
                                interests: [...(prev.interests || []), interestInput.trim()]
                              }));
                              setInterestInput('');
                            }
                          }
                        }}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (interestInput.trim() && !editFormData.interests?.includes(interestInput.trim())) {
                            setEditFormData(prev => ({
                              ...prev,
                              interests: [...(prev.interests || []), interestInput.trim()]
                            }));
                            setInterestInput('');
                          }
                        }}
                        style={{ padding: '0.5rem 1rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>
              )}

              {editFormData.role === 'ngo' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Name of the NGO</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Official Email ID</label>
                      <input
                        type="email"
                        required
                        value={editFormData.email || ''}
                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Official Website URL</label>
                      <input
                        type="url"
                        required
                        value={editFormData.website || ''}
                        onChange={e => setEditFormData({ ...editFormData, website: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Headquarters Address</label>
                    <input
                      type="text"
                      required
                      value={editFormData.headquarters || ''}
                      onChange={e => setEditFormData({ ...editFormData, headquarters: e.target.value })}
                      style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Primary Point of Contact Details</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Full Name</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocName || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocName: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Phone Number</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocPhone || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocPhone: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Designation</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocDesignation || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocDesignation: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Professional Email ID</label>
                        <input
                          type="email"
                          required
                          value={editFormData.pocEmail || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocEmail: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {editFormData.role === 'company' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Name of the Company</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Official Email ID</label>
                      <input
                        type="email"
                        required
                        value={editFormData.email || ''}
                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Website URL</label>
                      <input
                        type="url"
                        required
                        value={editFormData.website || ''}
                        onChange={e => setEditFormData({ ...editFormData, website: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Headquarters Address</label>
                      <input
                        type="text"
                        required
                        value={editFormData.headquarters || ''}
                        onChange={e => setEditFormData({ ...editFormData, headquarters: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Industry Sector</label>
                      <input
                        type="text"
                        required
                        value={editFormData.industrySector || ''}
                        onChange={e => setEditFormData({ ...editFormData, industrySector: e.target.value })}
                        style={{ padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Company Tag CSR Areas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Preferred CSR Focus Areas</label>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
                      border: '1px solid #E2E8F0', padding: '0.5rem',
                      borderRadius: '0.375rem', minHeight: '45px', background: '#F8FAFC',
                      alignItems: 'center'
                    }}>
                      {editFormData.csrFocus && editFormData.csrFocus.length > 0 ? (
                        editFormData.csrFocus.map((focus, idx) => (
                          <span key={idx} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            background: '#FFF9C4', color: '#F57F17', padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #FBC02D'
                          }}>
                            {focus}
                            <button
                              type="button"
                              onClick={() => {
                                setEditFormData(prev => ({
                                  ...prev,
                                  csrFocus: prev.csrFocus.filter(item => item !== focus)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No CSR areas selected yet</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Add CSR area..."
                        value={csrFocusInput}
                        onChange={e => setCsrFocusInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (csrFocusInput.trim() && !editFormData.csrFocus?.includes(csrFocusInput.trim())) {
                              setEditFormData(prev => ({
                                ...prev,
                                csrFocus: [...(prev.csrFocus || []), csrFocusInput.trim()]
                              }));
                              setCsrFocusInput('');
                            }
                          }
                        }}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (csrFocusInput.trim() && !editFormData.csrFocus?.includes(csrFocusInput.trim())) {
                            setEditFormData(prev => ({
                              ...prev,
                              csrFocus: [...(prev.csrFocus || []), csrFocusInput.trim()]
                            }));
                            setCsrFocusInput('');
                          }
                        }}
                        style={{ padding: '0.5rem 1rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Primary Point of Contact Details</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Full Name</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocName || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocName: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Phone Number</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocPhone || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocPhone: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Designation</label>
                        <input
                          type="text"
                          required
                          value={editFormData.pocDesignation || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocDesignation: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Professional Email ID</label>
                        <input
                          type="email"
                          required
                          value={editFormData.pocEmail || ''}
                          onChange={e => setEditFormData({ ...editFormData, pocEmail: e.target.value })}
                          style={{ padding: '0.5rem 0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  style={{
                    flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569',
                    border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '0.75rem', background: '#3D5A34', color: '#FFFFFF',
                    border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer'
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
                  borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer'
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
