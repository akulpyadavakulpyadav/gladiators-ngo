import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Globe, User, Shield, Hash, ArrowLeft, Save, Edit3, LogOut, Check, X, Briefcase } from 'lucide-react';
import ProfilePhotoUploader from '../../components/ProfilePhotoUploader';

const NgoProfile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Local state for editing form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    website: user?.website || '',
    headquarters: user?.headquarters || '',
    domain: user?.domain || 'Environment',
    customDomain: '',
    pocName: user?.pocName || '',
    pocPhone: user?.pocPhone || '',
    pocDesignation: user?.pocDesignation || '',
    pocEmail: user?.pocEmail || '',
    about: user?.about || ''
  });

  const [isCustomDomain, setIsCustomDomain] = useState(
    user?.domain && !['Environment', 'Education', 'Health', 'Disaster Relief', 'SDG 16', 'SDG 17'].includes(user?.domain)
  );

  const [notification, setNotification] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const standardDomains = [
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
        <h2 style={{ color: 'var(--color-primary)' }}>{t('access_denied_1', language)}</h2>
        <p style={{ margin: '1rem 0 2rem' }}>{t('please_log_in_to_vie_1', language)}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>{t('go_to_login_1', language)}</button>
      </div>
    );
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pocPhone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle domain dropdown changes
  const handleDomainChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsCustomDomain(true);
      setFormData(prev => ({ ...prev, domain: 'Other' }));
    } else {
      setIsCustomDomain(false);
      setFormData(prev => ({ ...prev, domain: value, customDomain: '' }));
    }
  };

  // Save changes
  const handleSave = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Organization name cannot be empty.' });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setNotification({ type: 'error', message: 'Please enter a valid NGO contact email.' });
      return;
    }
    if (!formData.headquarters.trim()) {
      setNotification({ type: 'error', message: 'Please enter NGO headquarters address.' });
      return;
    }
    
    // POC Validations
    if (!formData.pocName.trim()) {
      setNotification({ type: 'error', message: 'Point of Contact name cannot be empty.' });
      return;
    }
    if (formData.pocPhone.length !== 10) {
      setNotification({ type: 'error', message: 'Point of Contact phone must be exactly 10 digits.' });
      return;
    }
    if (!formData.pocEmail.trim() || !formData.pocEmail.includes('@')) {
      setNotification({ type: 'error', message: 'Please enter a valid Point of Contact email.' });
      return;
    }

    const finalDomain = isCustomDomain ? (formData.customDomain.trim() || 'Other Focus') : formData.domain;

    // Update in Auth Context
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      website: formData.website,
      headquarters: formData.headquarters,
      domain: finalDomain,
      pocName: formData.pocName,
      pocPhone: formData.pocPhone,
      pocDesignation: formData.pocDesignation,
      pocEmail: formData.pocEmail,
      about: formData.about
    });

    setIsEditing(false);
    setNotification({ type: 'success', message: 'NGO profile settings saved successfully!' });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
      
      {/* Top Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/ngo/dashboard')}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          Role: <span style={{ color: 'var(--color-primary)' }}>{t('ngo_portal', language)}</span>
        </span>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'success' ? '#E0F2F1' : '#FFEBEE',
          border: `1.5px solid ${notification.type === 'success' ? '#4DB6AC' : '#E57373'}`,
          color: notification.type === 'success' ? '#00695C' : '#C62828',
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

      {/* Main Grid */}
      <div className="grid-md-3-custom">
        
        {/* Left Summary Card */}
        <div className="glass-card profile-sidebar" style={{ padding: '2rem' }}>
          <div className="profile-summary-container">
            
            {/* Group 1: Avatar + Name + ID */}
            <div className="profile-summary-info">
              {/* Avatar Icon */}
              <div style={{ position: 'relative', flexShrink: 0, width: 120, height: 120 }}>
                <ProfilePhotoUploader 
                  currentPhoto={user.profilePhoto}
                  onPhotoUpdate={(base64) => updateUserProfile({ profilePhoto: base64 })}
                />
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  background: '#009688', border: '2.5px solid #FFFFFF',
                  borderRadius: '50%', width: 26, height: 26,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
              </div>

              <div className="profile-summary-info-text">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.25rem', lineHeight: 1.3 }}>{user.name}</h2>
                <div style={{ margin: '0.25rem 0' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '2rem',
                    background: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)',
                    border: '1px solid #4DB6AC', color: '#00695C',
                    boxShadow: '0 2px 4px rgba(0, 105, 92, 0.05)'
                  }}>
                    <Building2 size={14} />
                    <span>{t('gc_ngo_verified', language)}</span>
                  </div>
                </div>
                <div style={{ padding: '0.4rem 0.75rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 700, color: '#334155', fontFamily: 'monospace' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: '0.15rem' }}>{t('ngo_darpan_id', language)}</span>
                  {(() => {
                    const darpan = user.ngoDarpanId || '';
                    const clean = darpan.replace(/\s/g, '');
                    return clean.slice(0, 2) + 'X'.repeat(Math.max(0, clean.length - 2));
                  })()}
                </div>
              </div>
            </div>

            {/* Group 2: Sector focus display */}
            <div className="profile-summary-stats" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '240px', padding: '0.75rem 1rem', background: '#E0F2F1', borderRadius: 'var(--radius-sm)', border: '1px solid #B2DFDB', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#00695C', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{t('primary_focus_domain', language)}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#004D40' }}>{user.domain}</span>
              </div>
            </div>

            {/* Group 3: Logout Action */}
            <div className="profile-summary-actions">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="btn"
                style={{
                  width: '100%', padding: '0.75rem 1.5rem', background: '#EF4444', color: '#FFFFFF',
                  border: 'none', borderRadius: '9999px', fontWeight: 700,
                  fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#DC2626';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#EF4444';
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

          </div>
        </div>

        {/* Right Info Display */}
        <div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            
            {/* Header toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', margin: 0, fontFamily: 'var(--font-title)' }}>
                {isEditing ? 'Modify NGO Records' : 'NGO Verification Registry'}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      website: user.website || '',
                      headquarters: user.headquarters || '',
                      domain: standardDomains.includes(user.domain) ? user.domain : 'Other',
                      customDomain: standardDomains.includes(user.domain) ? '' : user.domain,
                      pocName: user.pocName || '',
                      pocPhone: user.pocPhone || '',
                      pocDesignation: user.pocDesignation || '',
                      pocEmail: user.pocEmail || '',
                      about: user.about || ''
                    });
                    setIsCustomDomain(!standardDomains.includes(user.domain));
                    setIsEditing(true);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={14} /> Edit Details
                </button>
              )}
            </div>

            {/* Display/Edit form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* NGO Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('organization_registe', language)}</label>
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

                {/* Grid for Email & Website */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-sm-1">
                  
                  {/* Official Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('official_ngo_email_i', language)}</label>
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

                  {/* Website */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('website_web_portal', language)}</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        className="form-input"
                        style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                        value={formData.website}
                        onChange={handleChange}
                        placeholder={t('https_example_org', language)}
                      />
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={15} style={{ color: '#64748B' }} />
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: '#00695C', textDecoration: 'underline' }}>
                            {user.website}
                          </a>
                        ) : (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>{t('not_provided_1', language)}</span>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* HQ Headquarters Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('headquarters_address_2', language)}</label>
                  {isEditing ? (
                    <textarea
                      name="headquarters"
                      required
                      className="form-input"
                      rows="3"
                      style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1', minHeight: 80, resize: 'vertical', padding: '0.6rem 0.75rem' }}
                      value={formData.headquarters}
                      onChange={handleChange}
                      placeholder={t('full_official_office', language)}
                    />
                  ) : (
                    <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      <MapPin size={16} style={{ color: '#64748B', marginTop: '0.15rem', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'pre-wrap' }}>{user.headquarters}</span>
                    </div>
                  )}
                </div>

                {/* About NGO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>About NGO</label>
                  {isEditing ? (
                    <textarea
                      name="about"
                      className="form-input"
                      rows="3"
                      style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1', minHeight: 80, resize: 'vertical', padding: '0.6rem 0.75rem' }}
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Write about your NGO..."
                    />
                  ) : (
                    <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.5 }}>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{user.about || 'No information provided.'}</span>
                    </div>
                  )}
                </div>

                {/* Focus Domain & REDACT PIN / sensitive row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-sm-1">
                  
                  {/* Focus Domain Select */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('ngo_core_focus_domai', language)}</label>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <select
                          className="form-input"
                          style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                          value={formData.domain}
                          onChange={handleDomainChange}
                        >
                          {standardDomains.map(dom => (
                            <option key={dom} value={dom}>{dom}</option>
                          ))}
                          <option value="Other">{t('other_focus_domain', language)}</option>
                        </select>
                        {isCustomDomain && (
                          <input
                            type="text"
                            name="customDomain"
                            required
                            placeholder={t('specify_custom_focus', language)}
                            className="form-input animate-fade-in"
                            style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                            value={formData.customDomain}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={15} style={{ color: '#64748B' }} />
                        {user.domain} Focus
                      </div>
                    )}
                  </div>

                  {/* Redacted PIN Data */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('ngo_security_pin', language)}</label>
                    <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px dashed #FCA5A5', color: '#C62828', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                      Verification PIN Redacted (Security Protocol)
                    </div>
                  </div>

                </div>

                {/* Sub-Section: Point of Contact (POC) Records */}
                <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '1rem', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} style={{ color: '#00695C' }} /> Point of Contact (POC) Details
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-sm-1">
                    
                    {/* POC Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('poc_full_name_3', language)}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pocName"
                          required
                          className="form-input"
                          style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                          value={formData.pocName}
                          onChange={handleChange}
                        />
                      ) : (
                        <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600 }}>
                          {user.pocName}
                        </div>
                      )}
                    </div>

                    {/* POC Designation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('poc_designation_1', language)}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pocDesignation"
                          required
                          className="form-input"
                          style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                          value={formData.pocDesignation}
                          onChange={handleChange}
                        />
                      ) : (
                        <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600 }}>
                          {user.pocDesignation || 'Director'}
                        </div>
                      )}
                    </div>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }} className="grid-sm-1">
                    
                    {/* POC Phone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('poc_phone_number_1', language)}</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pocPhone"
                          required
                          className="form-input"
                          style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                          value={formData.pocPhone}
                          onChange={handleChange}
                          placeholder={t('10_digit_number_1', language)}
                        />
                      ) : (
                        <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Phone size={14} style={{ color: '#64748B' }} />
                          +91 {user.pocPhone}
                        </div>
                      )}
                    </div>

                    {/* POC Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('poc_official_email', language)}</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="pocEmail"
                          required
                          className="form-input"
                          style={{ color: '#1E293B', background: '#FFFFFF', border: '1.5px solid #CBD5E1' }}
                          value={formData.pocEmail}
                          onChange={handleChange}
                        />
                      ) : (
                        <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Mail size={14} style={{ color: '#64748B' }} />
                          {user.pocEmail}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>

              {/* Action Save/Discard buttons */}
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
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #00695C, #4DB6AC)' }}
                  >
                    <Save size={16} /> Save Settings
                  </button>
                </div>
              )}

            </form>

          </div>
        </div>

      </div>

      {/* Logout modal */}
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
              Confirm NGO Logout
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
                  flex: 1, padding: '0.75rem 1.5rem', background: '#EF4444', color: '#FFFFFF',
                  border: 'none', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.2s ease', outline: 'none', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#DC2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NgoProfile;
