import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Award, Heart, Edit3, ArrowLeft, Save, LogOut, Check, X } from 'lucide-react';

const VolunteerProfile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Local state for editing form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    age: user?.age || '',
    address: user?.address || user?.location || '', // fall back to location if address not defined yet
    interests: user?.interests || []
  });

  const [notification, setNotification] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  const availableInterests = [
    'Environment',
    'Education',
    'Health',
    'Disaster Relief',
    'SDG 16',
    'SDG 17'
  ];

  if (!user) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 500, margin: '4rem auto' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Access Denied</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Please log in to view your volunteer profile page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      // Age must be digits only
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add an interest tag
  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  // Remove an interest tag
  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interestToRemove)
    }));
  };

  // Save changes
  const handleSave = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }
    if (formData.phone.length !== 10) {
      setNotification({ type: 'error', message: 'Phone number must be exactly 10 digits.' });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setNotification({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (!formData.age || parseInt(formData.age, 10) <= 0) {
      setNotification({ type: 'error', message: 'Please enter a valid age.' });
      return;
    }
    if (!formData.address.trim()) {
      setNotification({ type: 'error', message: 'Please enter your full address.' });
      return;
    }

    // Update state in Context
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      age: formData.age,
      address: formData.address,
      interests: formData.interests,
      location: formData.address.split(',')[0] || formData.address // sync location for backwards-compatibility
    });

    setIsEditing(false);
    setNotification({ type: 'success', message: 'Profile updated successfully!' });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
      
      {/* Top Navigation / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/volunteer/dashboard')}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          Role: <span style={{ color: 'var(--color-primary)' }}>Volunteer</span>
        </span>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'success' ? '#E8F5E9' : '#FFEBEE',
          border: `1.5px solid ${notification.type === 'success' ? '#81C784' : '#E57373'}`,
          color: notification.type === 'success' ? '#2E7D32' : '#C62828',
          fontWeight: 600,
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }} className="grid-md-3-custom">
        {/* Left Side: Summary Card (Redacts Sensitive Aadhaar/PIN) */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', position: 'sticky', top: '9rem' }}>
          
          {/* Avatar & Badges */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A6741, #2D4A22)',
              border: '4px solid #FFFFFF', color: '#FFFFFF',
              fontSize: '2.5rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              background: '#10B981', border: '2.5px solid #FFFFFF',
              borderRadius: '50%', width: 26, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Check size={16} strokeWidth={3} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.25rem' }}>{user.name}</h2>
          
          <div style={{ margin: '0.5rem 0 1rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '2rem',
              background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
              border: '1px solid #81C784', color: '#2E7D32',
              boxShadow: '0 2px 4px rgba(46, 125, 50, 0.05)'
            }}>
              <Heart size={14} fill="#2E7D32" />
              <span>GC-VLT Verified</span>
            </div>
          </div>

          <div style={{ width: '100%', padding: '0.75rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GladiConnect ID</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', fontFamily: 'monospace' }}>{user.gcId}</span>
          </div>

          {/* Quick Stats to make the profile page look premium */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
            <div style={{ flex: 1, padding: '0.75rem 0.5rem', background: '#E8F5E9', borderRadius: 'var(--radius-sm)', border: '1px solid #C8E6C9' }}>
              <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#2E7D32' }}>120</span>
              <span style={{ fontSize: '0.7rem', color: '#2E7D32', fontWeight: 600 }}>Hours</span>
            </div>
            <div style={{ flex: 1, padding: '0.75rem 0.5rem', background: '#FFF9C4', borderRadius: 'var(--radius-sm)', border: '1px solid #FFF59D' }}>
              <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#F57F17' }}>3</span>
              <span style={{ fontSize: '0.7rem', color: '#F57F17', fontWeight: 600 }}>Badges</span>
            </div>
            <div style={{ flex: 1, padding: '0.75rem 0.5rem', background: '#E3F2FD', borderRadius: 'var(--radius-sm)', border: '1px solid #BBDEFB' }}>
              <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#1565C0' }}>8</span>
              <span style={{ fontSize: '0.7rem', color: '#1565C0', fontWeight: 600 }}>Events</span>
            </div>
          </div>

          {/* Logout Trigger */}
          <div style={{ width: '100%', marginTop: 'auto' }}>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="btn"
              style={{
                width: '100%', padding: '0.75rem', background: '#FEF2F2', color: '#EF4444',
                border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', fontWeight: 700,
                fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#EF4444';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FEF2F2';
                e.currentTarget.style.color = '#EF4444';
              }}
            >
              <LogOut size={16} /> Logout Account
            </button>
          </div>
        </div>

        {/* Right Side: Professional Info Display (Redacts PIN & Aadhaar) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            
            {/* Header section with toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', margin: 0, fontFamily: 'var(--font-title)' }}>
                {isEditing ? 'Modify Personal Records' : 'Professional Profile Record'}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => {
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
                      email: user.email || '',
                      age: user.age || '',
                      address: user.address || user.location || '',
                      interests: user.interests || []
                    });
                    setIsEditing(true);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={14} /> Edit Details
                </button>
              )}
            </div>

            {/* Display/Edit Form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Profile Record Table (Styled elegantly) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name (Government Records)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      required
                      className="form-input"
                      style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600 }}>
                      {user.name}
                    </div>
                  )}
                </div>

                {/* Grid for Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-sm-1">
                  
                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        required
                        className="form-input"
                        style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={15} style={{ color: '#64748B' }} />
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        required
                        className="form-input"
                        style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                      />
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={15} style={{ color: '#64748B' }} />
                        +91 {user.phone}
                      </div>
                    )}
                  </div>

                </div>

                {/* Age & Sensitive Data Redaction Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-sm-1">
                  
                  {/* Age */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Age (Digits only)</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="age"
                        required
                        className="form-input"
                        style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                        value={formData.age}
                        onChange={handleChange}
                      />
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={15} style={{ color: '#64748B' }} />
                        {user.age} Years Old
                      </div>
                    )}
                  </div>

                  {/* Redacted Identity Verification (Aadhaar / PIN) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Aadhaar & PIN Security</label>
                    <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px dashed #FCA5A5', color: '#C62828', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                      Sensitive Government Data Redacted
                    </div>
                  </div>

                </div>

                {/* Full Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Delivery & Contact Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      required
                      className="form-input"
                      rows="3"
                      style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1', minHeight: 80, resize: 'vertical', padding: '0.6rem 0.75rem' }}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter house no, street address, locality, city, state"
                    />
                  ) : (
                    <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, minHeight: 50, display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      <MapPin size={16} style={{ color: '#64748B', marginTop: '0.15rem', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'pre-wrap' }}>{user.address || user.location}</span>
                    </div>
                  )}
                </div>

                {/* Interests Tag Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Primary Social Impact Interests</label>
                  
                  {isEditing ? (
                    <div style={{ padding: '1rem', background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem', minHeight: 38, alignItems: 'center' }}>
                        {formData.interests.length > 0 ? (
                          formData.interests.map((interest, idx) => (
                            <span key={idx} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                              background: '#E2E8F0', color: '#334155', padding: '0.25rem 0.6rem',
                              borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 600
                            }}>
                              {interest}
                              <button
                                type="button"
                                onClick={() => removeInterest(interest)}
                                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '0.85rem', fontStyle: 'italic' }}>Select interests from options below</span>
                        )}
                      </div>

                      {/* Options to add */}
                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>Click to add focus areas:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {availableInterests.map((interest) => {
                            const isAdded = formData.interests.includes(interest);
                            return (
                              <button
                                key={interest}
                                type="button"
                                disabled={isAdded}
                                onClick={() => addInterest(interest)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  borderRadius: '0.25rem',
                                  border: '1px solid',
                                  borderColor: isAdded ? '#CBD5E1' : '#81C784',
                                  background: isAdded ? '#F1F5F9' : '#E8F5E9',
                                  color: isAdded ? '#94A3B8' : '#2E7D32',
                                  cursor: isAdded ? 'default' : 'pointer',
                                  transition: 'all 0.1s'
                                }}
                              >
                                + {interest}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem 0' }}>
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, idx) => (
                          <span key={idx} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                            border: '1px solid #81C784', color: '#2E7D32',
                            padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 2px 4px rgba(46, 125, 50, 0.05)'
                          }}>
                            <Heart size={12} fill="#2E7D32" />
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontStyle: 'italic', color: '#64748B', fontSize: '0.85rem' }}>No social interests specified</span>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Form Action Buttons (Save/Cancel) */}
              {isEditing && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Save size={16} /> Save Settings
                  </button>
                </div>
              )}

            </form>

          </div>
        </div>

      </div>

      {/* Logout Confirmation Modal Overlay */}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
              Confirm Profile Logout
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Do you want to logout? Any unsaved changes in your session will be cleared.
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

export default VolunteerProfile;
