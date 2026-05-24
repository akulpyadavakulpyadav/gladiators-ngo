import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Users, WifiOff, Wifi, IndianRupee, MessageSquare, Plus, Save, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

/* ─── Impact Profile ─── */
const ImpactProfile = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', background: 'var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '3px solid white', boxShadow: 'var(--shadow-sm)'
          }}>
            <Camera size={32} style={{ color: '#94A3B8' }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: 'var(--color-primary)' }}>
              {user?.name || 'NGO Name'}
            </h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              {user?.about || 'No about information provided.'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-primary">{user?.domain || 'Environment'}</span>
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
          </div>
          <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>{t('edit_profile', language)}</button>
        </div>
      </div>

      <div>
        <h3 className="section-title">{t('media_gallery', language)}</h3>
        <div className="grid grid-md-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              aspectRatio: '1', background: 'var(--color-border)', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'opacity 0.2s'
            }}>
              <Camera size={24} style={{ color: '#94A3B8' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Management Suite ─── */
const ManagementSuite = () => {
  const { language } = useLanguage();

  const getStatLabelKey = (label) => {
    if (label === 'Total Volunteers') return 'total_volunteers';
    if (label === 'Active Campaigns') return 'active_campaigns';
    if (label === 'Total Hours Logged') return 'total_hours_logged';
    return label;
  };

  const getStatusTranslation = (status, lang) => {
    if (status === 'Active') return lang === 'KN' ? 'ಸಕ್ರಿಯ' : lang === 'HI' ? 'सक्रिय' : 'Active';
    if (status === 'Inactive') return lang === 'KN' ? 'ನಿಷ್ಕ್ರಿಯ' : lang === 'HI' ? 'निष्क्रिय' : 'Inactive';
    return status;
  };

  const getRoleTranslation = (role, lang) => {
    if (role === 'Field Coordinator') return lang === 'KN' ? 'ಕ್ಷೇತ್ರ ಸಂಯೋಜಕರು' : lang === 'HI' ? 'क्षेत्र समन्वयक' : 'Field Coordinator';
    if (role === 'Content Creator') return lang === 'KN' ? 'ವಿಷಯ ರಚನೆಕಾರರು' : lang === 'HI' ? 'सामग्री निर्माता' : 'Content Creator';
    if (role === 'Logistics') return lang === 'KN' ? 'ಲಾಜಿಸ್ಟಿಕ್ಸ್' : lang === 'HI' ? 'लॉजिस्टिक्स' : 'Logistics';
    return role;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>{t('vol_management', language)}</h2>
        <button className="btn btn-primary"><Plus size={16} /> {t('broadcast_need', language)}</button>
      </div>

      <div className="grid grid-md-3">
        {[
          { label: 'Total Volunteers', value: '1,245', color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Active Campaigns', value: '4', color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Total Hours Logged', value: '14,500+', color: 'var(--color-warning)', bg: 'rgba(0, 0, 0, 0.05)' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><span style={{ color: s.color, fontWeight: 800 }}>●</span></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{t(getStatLabelKey(s.label), language)}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('name', language)}</th>
              <th>{t('role', language)}</th>
              <th>{t('hours', language)}</th>
              <th>{t('status', language)}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Rahul Sharma', role: 'Field Coordinator', hours: 120, status: 'Active' },
              { name: 'Priya Patel', role: 'Content Creator', hours: 45, status: 'Inactive' },
              { name: 'Amit Singh', role: 'Logistics', hours: 85, status: 'Active' }
            ].map((v, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{v.name}</td>
                <td>{getRoleTranslation(v.role, language)}</td>
                <td>{v.hours} {language === 'KN' ? 'ಗಂಟೆಗಳು' : language === 'HI' ? 'घंटे' : 'hrs'}</td>
                <td><span className={`badge ${v.status === 'Active' ? 'badge-secondary' : 'badge-warning'}`}>{getStatusTranslation(v.status, language)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Offline Event Logger ─── */
const OfflineEventLogger = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState({ title: '', attendees: '', location: '' });

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    const stored = localStorage.getItem('gladiconnect_offline_events');
    if (stored) setEvents(JSON.parse(stored));
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const newEvent = { ...formData, id: Date.now(), synced: isOnline };
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('gladiconnect_offline_events', JSON.stringify(updated));
    setFormData({ title: '', attendees: '', location: '' });
  };

  const handleSync = () => {
    const updated = events.map(ev => ({ ...ev, synced: true }));
    setEvents(updated);
    localStorage.setItem('gladiconnect_offline_events', JSON.stringify(updated));
  };

  const unsyncedCount = events.filter(e => !e.synced).length;

  return (
    <div className="animate-fade-in grid grid-md-2">
      {/* Form */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>{t('log_new_event', language)}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isOnline ? <Wifi size={14} style={{ color: 'var(--color-secondary)' }} /> : <WifiOff size={14} style={{ color: 'var(--color-warning)' }} />}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOnline ? 'var(--color-secondary)' : 'var(--color-warning)' }}>
              {isOnline ? t('online', language) : t('offline', language)}
            </span>
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">{t('event_title', language)}</label>
            <input type="text" className="form-input" placeholder={t('event_cleanup', language)} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('location', language)}</label>
            <input type="text" className="form-input" placeholder={t('placeholder_location', language)} required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('attendees', language)}</label>
            <input type="number" className="form-input" placeholder="0" required value={formData.attendees} onChange={e => setFormData({...formData, attendees: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Save size={16} /> {t('save_event', language)}</button>
        </form>
      </div>

      {/* Event List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>{t('event_logs', language)}</h3>
          {isOnline && unsyncedCount > 0 && (
            <button onClick={handleSync} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              {t('sync_items', language).replace('items', `${unsyncedCount} ${language === 'KN' ? 'ಐಟಂಗಳು' : language === 'HI' ? 'मद' : 'items'}`)}
            </button>
          )}
        </div>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' }}>{t('no_events_yet', language)}</p>
        ) : (
          <div className="space-y-4" style={{ maxHeight: 380, overflowY: 'auto' }}>
            {events.map(ev => (
              <div key={ev.id} className="list-item">
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{ev.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {ev.location === 'Bangalore' || ev.location === 'ಬೆಂಗಳೂರು' ? (language === 'KN' ? 'ಬೆಂಗಳೂರು' : language === 'HI' ? 'बेंगलुरु' : 'Bangalore') : ev.location} · {ev.attendees} {language === 'KN' ? 'ಭಾಗವಹಿಸುವವರು' : language === 'HI' ? 'प्रतिभागी' : 'attendees'}
                  </p>
                </div>
                <span className={`badge ${ev.synced ? 'badge-secondary' : 'badge-warning'}`}>
                  {ev.synced 
                    ? (language === 'KN' ? 'ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ' : language === 'HI' ? 'सिंक किया गया' : 'Synced') 
                    : (language === 'KN' ? 'ಬಾಕಿ ಇದೆ' : language === 'HI' ? 'लंबित' : 'Pending')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Finance Suite ─── */
const FinanceSuite = () => {
  const { language } = useLanguage();
  return (
    <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ 
        width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
      }}>
        <IndianRupee size={32} style={{ color: 'var(--color-secondary)' }} />
      </div>
      <h2 className="text-gradient-secondary" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('finance_title', language)}</h2>
      <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
        {t('finance_desc', language)}
      </p>
      <button className="btn btn-secondary">{t('gen_report', language)}</button>
    </div>
  );
};

/* ─── Collab Hub ─── */
const CollabHub = () => {
  const { language } = useLanguage();
  return (
    <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ 
        width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
      }}>
        <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
      </div>
      <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('collab_hub_title', language)}</h2>
      <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
        {t('collab_hub_desc', language)}
      </p>
      <button className="btn btn-primary">{t('explore_partnerships', language)}</button>
    </div>
  );
};

/* ─── NGO Dashboard ─── */
const NgoDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('impact');

  const tabs = [
    { id: 'impact', label: t('tab_impact_profile', language), icon: <Camera size={16} /> },
    { id: 'management', label: t('tab_management', language), icon: <Users size={16} /> },
    { id: 'offline', label: t('tab_offline_logger', language), icon: <WifiOff size={16} /> },
    { id: 'finance', label: t('tab_finance', language), icon: <IndianRupee size={16} /> },
    { id: 'collab', label: t('tab_collab', language), icon: <MessageSquare size={16} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">{t('ngo_dash_title', language)}</h1>
        <p>{t('welcome_back', language)} <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 400 }}>
        {activeTab === 'impact' && <ImpactProfile />}
        {activeTab === 'management' && <ManagementSuite />}
        {activeTab === 'offline' && <OfflineEventLogger />}
        {activeTab === 'finance' && <FinanceSuite />}
        {activeTab === 'collab' && <CollabHub />}
      </div>
    </div>
  );
};

export default NgoDashboard;
