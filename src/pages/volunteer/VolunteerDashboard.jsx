import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Target, Calendar, Award, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

/* ─── NGO Directory ─── */
const DirectorySearch = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const getInitialDomain = () => {
    const interests = Array.isArray(user?.interests)
      ? user.interests
      : (typeof user?.interests === 'string' && user.interests ? [user.interests] : []);
    if (interests.length > 0) {
      return 'My Interests';
    }
    return 'All';
  };
  const [domainFilter, setDomainFilter] = useState(getInitialDomain());

  const ngos = [
    // Environment
    { id: 1, name: 'Global Green Initiative', domain: 'Environment', location: 'Bangalore', verified: true },
    { id: 2, name: 'OceanSavers Network', domain: 'Environment', location: 'Chennai', verified: true },
    { id: 3, name: 'GreenSpace Alliance', domain: 'Environment', location: 'Mysore', verified: true },
    { id: 4, name: 'EarthRestore Foundation', domain: 'Environment', location: 'Kochi', verified: false },
    { id: 5, name: 'CanopyProtection Trust', domain: 'Environment', location: 'Pune', verified: true },
    
    // Education
    { id: 6, name: 'EduCare Foundation', domain: 'Education', location: 'Delhi', verified: true },
    { id: 7, name: 'LiteracyForAll Trust', domain: 'Education', location: 'Hyderabad', verified: true },
    { id: 8, name: 'SparkMind Academy', domain: 'Education', location: 'Mumbai', verified: false },
    { id: 9, name: 'FutureLeaders NGO', domain: 'Education', location: 'Kolkata', verified: true },
    { id: 10, name: 'Sharda Vidya Mandir', domain: 'Education', location: 'Bangalore', verified: true },
    
    // Health
    { id: 11, name: 'HealthFirst NGO', domain: 'Health', location: 'Mumbai', verified: false },
    { id: 12, name: 'MedLife Foundation', domain: 'Health', location: 'Bangalore', verified: true },
    { id: 13, name: 'CarePlus Clinic NGO', domain: 'Health', location: 'Ahmedabad', verified: true },
    { id: 14, name: 'HealIndia Society', domain: 'Health', location: 'Delhi', verified: true },
    { id: 15, name: 'Aarogya Seva', domain: 'Health', location: 'Pune', verified: false },

    // Disaster Relief
    { id: 16, name: 'RapidResponse India', domain: 'Disaster Relief', location: 'Delhi', verified: true },
    { id: 17, name: 'SankatMochan Foundation', domain: 'Disaster Relief', location: 'Mumbai', verified: true },
    { id: 18, name: 'RescueForce NGO', domain: 'Disaster Relief', location: 'Bangalore', verified: false },
    { id: 19, name: 'AapdaMitra Society', domain: 'Disaster Relief', location: 'Kochi', verified: true },
    { id: 20, name: 'RedCross Relief Alliance', domain: 'Disaster Relief', location: 'Chennai', verified: true },

    // Animal Welfare
    { id: 21, name: 'Paws & Claws Sanctuary', domain: 'Animal Welfare', location: 'Bangalore', verified: true },
    { id: 22, name: 'Jeev Daya Trust', domain: 'Animal Welfare', location: 'Ahmedabad', verified: true },
    { id: 23, name: 'FaunaShield Alliance', domain: 'Animal Welfare', location: 'Pune', verified: false },
    { id: 24, name: 'WildlifeRescue India', domain: 'Animal Welfare', location: 'Delhi', verified: true },
    { id: 25, name: 'StrayCare Foundation', domain: 'Animal Welfare', location: 'Mumbai', verified: true },

    // Rural Development
    { id: 26, name: 'Gram Vikas Samiti', domain: 'Rural Development', location: 'Pune', verified: true },
    { id: 27, name: 'VillageProgress Trust', domain: 'Rural Development', location: 'Bangalore', verified: true },
    { id: 28, name: 'KrishiSahay NGO', domain: 'Rural Development', location: 'Hyderabad', verified: false },
    { id: 29, name: 'RuralElevate Foundation', domain: 'Rural Development', location: 'Kolkata', verified: true },
    { id: 30, name: 'GraminSeva Mandir', domain: 'Rural Development', location: 'Delhi', verified: true }
  ];

  const getDomainTranslationKey = (domain) => {
    if (domain === 'Environment') return 'filter_env';
    if (domain === 'Education') return 'filter_edu';
    if (domain === 'Health') return 'filter_health';
    if (domain === 'Disaster Relief') return 'filter_relief';
    if (domain === 'Animal Welfare') return 'filter_animal';
    if (domain === 'Rural Development') return 'filter_rural';
    return domain;
  };

  const filtered = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (domainFilter === 'All') {
      return matchesSearch;
    }
    if (domainFilter === 'My Interests') {
      const interests = Array.isArray(user?.interests) 
        ? user.interests 
        : (typeof user?.interests === 'string' && user.interests ? [user.interests] : []);
      return interests.includes(ngo.domain) && matchesSearch;
    }
    return ngo.domain === domainFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder={t('search_placeholder', language)}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-input"
            style={{ width: 'auto', minWidth: 160 }}
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
          >
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="All">{t('filter_all', language)}</option>
            {((Array.isArray(user?.interests) && user.interests.length > 0) || (typeof user?.interests === 'string' && user?.interests)) && (
              <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="My Interests">{t('filter_my_interests', language)}</option>
            )}
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Environment">{t('filter_env', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Education">{t('filter_edu', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Health">{t('filter_health', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Disaster Relief">{t('filter_relief', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Animal Welfare">{t('filter_animal', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Rural Development">{t('filter_rural', language)}</option>
          </select>
        </div>
      </div>

      {/* NGO Cards */}
      <div className="grid grid-md-3">
        {filtered.map(ngo => (
          <div key={ngo.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.3, margin: 0 }}>{ngo.name}</h3>
              {ngo.verified && <span className="badge badge-secondary" style={{ flexShrink: 0, marginLeft: '0.5rem' }}>{t('badge_verified', language)}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              <Target size={14} /> {t(getDomainTranslationKey(ngo.domain), language)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              <MapPin size={14} /> {ngo.location === 'Bangalore' ? (language === 'KN' ? 'ಬೆಂಗಳೂರು' : language === 'HI' ? 'बेंगलुरु' : 'Bangalore') : ngo.location}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}>{t('btn_connect', language)}</button>
              <button className="btn btn-outline">{t('btn_profile', language)}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Impact Dashboard ─── */
const ImpactDashboard = () => {
  const { language } = useLanguage();

  const getStatLabelTranslationKey = (label) => {
    if (label === 'Hours Volunteered') return 'stat_hours';
    if (label === 'Badges Earned') return 'stat_badges';
    if (label === 'Events Attended') return 'stat_events';
    return label;
  };

  const getEventTranslationKey = (event) => {
    if (event === 'Beach Cleanup Drive') return 'event_cleanup';
    if (event === 'Tree Plantation Session') return 'event_plantation';
    if (event === 'Weekend Mentorship') return 'event_mentor';
    return event;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-md-3">
        {[
          { icon: Clock, label: 'Hours Volunteered', value: '120', color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { icon: Award, label: 'Badges Earned', value: '3', color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { icon: Calendar, label: 'Events Attended', value: '8', color: 'var(--color-warning)', bg: 'rgba(0, 0, 0, 0.05)' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{t(getStatLabelTranslationKey(s.label), language)}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 className="section-title">{t('recent_activity', language)}</h3>
        <div className="space-y-4">
          {[
            { event: 'Beach Cleanup Drive', ngo: 'OceanSavers Network', hours: 4, date: 'Oct 12, 2024' },
            { event: 'Tree Plantation Session', ngo: 'Global Green Initiative', hours: 6, date: 'Sep 28, 2024' },
            { event: 'Weekend Mentorship', ngo: 'EduCare Foundation', hours: 2, date: 'Sep 15, 2024' }
          ].map((act, i) => (
            <div key={i} className="list-item">
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0 }}>{t(getEventTranslationKey(act.event), language)}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>{act.ngo} · {act.date}</p>
              </div>
              <span className="badge badge-primary">+{act.hours} {language === 'KN' ? 'ಗಂಟೆಗಳು' : language === 'HI' ? 'घंटे' : 'hrs'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Volunteer Dashboard ─── */
const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('directory');

  const tabs = [
    { id: 'directory', label: t('tab_directory', language) },
    { id: 'impact', label: t('tab_impact', language) }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">{t('vol_dash_title', language)}</h1>
        <p>{t('make_impact', language)} <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 400 }}>
        {activeTab === 'directory' && <DirectorySearch />}
        {activeTab === 'impact' && <ImpactDashboard />}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
