import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Target, Calendar, Award, Clock, Users, Activity, X, Building2, Camera, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

/* ─── Program Feed ─── */
const DirectorySearch = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [applyMessage, setApplyMessage] = useState('');

  const [userApplications, setUserApplications] = useState([]);

  const getInitialDomain = () => {
    const interests = Array.isArray(user?.interests)
      ? user.interests
      : (typeof user?.interests === 'string' && user.interests ? [user.interests] : []);
    if (interests.length > 0) {
      return interests[0];
    }
    return 'All';
  };
  const [domainFilter, setDomainFilter] = useState(getInitialDomain());

  useEffect(() => {
    fetchPrograms();
    if (user?._id || user?.gcId) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/programs');
      const data = await res.json();
      setPrograms(data);
    } catch (e) { console.error(e); }
  };

  const fetchUserApplications = async () => {
    try {
      const id = user?._id || user?.gcId;
      const res = await fetch(`http://localhost:5000/api/applications/volunteer/${id}`);
      const data = await res.json();
      setUserApplications(data);
    } catch (e) { console.error(e); }
  };

  const getDomainTranslationKey = (domain) => {
    if (domain === 'Environment') return 'filter_env';
    if (domain === 'Education') return 'filter_edu';
    if (domain === 'Health') return 'filter_health';
    if (domain === 'Disaster Relief') return 'filter_relief';
    if (domain === 'Animal Welfare') return 'filter_animal';
    if (domain === 'Rural Development') return 'filter_rural';
    return domain;
  };

  const filtered = programs.filter(program => {
    const ngo = program.ngoId;
    if (!ngo) return false;
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || ngo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (domainFilter === 'All') return matchesSearch;
    
    if (domainFilter === 'My Interests') {
      const interests = Array.isArray(user?.interests) 
        ? user.interests 
        : (typeof user?.interests === 'string' && user.interests ? [user.interests] : []);
      return interests.includes(ngo.domain) && matchesSearch;
    }
    return ngo.domain === domainFilter && matchesSearch;
  });

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: selectedProgram._id,
          ngoId: selectedProgram.ngoId._id || selectedProgram.ngoId,
          volunteerId: user?._id || user?.gcId,
          roleApplied: selectedRole
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyMessage(data.message || 'Error applying');
      } else {
        setApplyMessage('Application submitted successfully!');
        const id = user?._id || user?.gcId;
        fetchUserApplications(); // Refresh to show new status
        setTimeout(() => {
          setShowApplyModal(false);
          setApplyMessage('');
          setSelectedRole('');
        }, 1500);
      }
    } catch (e) {
      setApplyMessage('Network error');
    }
  };

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
              <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="My Interests">My Interests</option>
            )}
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Environment">{t('filter_env', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Education">{t('filter_edu', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Health">{t('filter_health', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Disaster Relief">Disaster Relief</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Animal Welfare">Animal Welfare</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Rural Development">Rural Development</option>
          </select>
        </div>
      </div>

      {/* Program Cards */}
      <div className="grid grid-md-3">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            No programs available at the moment.
          </div>
        ) : filtered.map(program => (
          <div key={program._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.3, margin: 0 }}>{program.title}</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', flex: 1 }}>
              {program.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem', fontWeight: 600 }}>
              <Award size={14} /> {program.ngoId?.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              <Target size={14} /> {t(getDomainTranslationKey(program.ngoId?.domain), language)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              <MapPin size={14} /> {program.location || (program.ngoId?.location === 'Bangalore' ? (language === 'KN' ? 'ಬೆಂಗಳೂರು' : language === 'HI' ? 'बेंगलुरु' : 'Bangalore') : (program.ngoId?.location || program.ngoId?.headquarters || 'Location TBD'))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
              {(() => {
                const app = userApplications.find(a => (a.programId?._id === program._id || a.programId === program._id));
                if (app) {
                  return (
                    <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600 }}>
                      {app.status === 'Approved' ? 'Active' : app.status}
                    </div>
                  );
                }
                return (
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setSelectedProgram(program); setSelectedRole(''); setApplyMessage(''); setShowApplyModal(true); }}>
                    {t('btn_connect', language)}
                  </button>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {showApplyModal && selectedProgram && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
               <h3 className="section-title" style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)', paddingRight: '2rem' }}>{selectedProgram.title}</h3>
               <button type="button" onClick={() => setShowApplyModal(false)} style={{ background: '#F1F5F9', border: 'none', color: '#334155', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                 <X size={16} />
               </button>
            </div>
            
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
               <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>Program Description</h4>
               <p style={{ fontSize: '0.95rem', color: '#475569', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
                 {selectedProgram.description}
               </p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>Hosted by:</span> {selectedProgram.ngoId?.name}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>Location:</span> {selectedProgram.location || selectedProgram.ngoId?.location || selectedProgram.ngoId?.headquarters || 'TBD'}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Roles Needed:</span> 
                    {selectedProgram.rolesNeeded.map((role, i) => (
                      <span key={i} className="badge badge-primary" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>{role}</span>
                    ))}
                 </div>
               </div>
            </div>

            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
               <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#334155' }}>About the NGO</h4>
               <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                 {selectedProgram.ngoId?.about || 'No description provided by the NGO.'}
               </p>
               <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                 <span style={{ display: 'flex', alignItems: 'center' }}>
                   <Target size={14} style={{ marginRight: '6px' }} />
                   <span style={{ fontWeight: 600, color: '#334155', marginRight: '4px' }}>Domain:</span> 
                   {selectedProgram.ngoId?.domain}
                 </span>
               </div>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
                  <div style={{ flex: 1, textAlign: 'center', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Users size={16} style={{ color: 'var(--color-secondary)', margin: '0 auto 0.25rem auto' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>{(selectedProgram.ngoId?.name?.length || 10) * 12 + 45}+</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Volunteers</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Clock size={16} style={{ color: 'var(--color-secondary)', margin: '0 auto 0.25rem auto' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>{((selectedProgram.ngoId?.name?.length || 10) * 12 + 45) * 24}+</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Hours Logged</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <Activity size={16} style={{ color: 'var(--color-secondary)', margin: '0 auto 0.25rem auto' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>{(selectedProgram.ngoId?.name?.length || 10) * 2}+</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Campaigns</div>
                  </div>
               </div>
            </div>
            
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Select Role to Apply</label>
                <select className="form-input" required value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                  <option value="" disabled>Select a role...</option>
                  {selectedProgram.rolesNeeded.map((role, idx) => (
                    <option key={idx} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {applyMessage && (
                <div style={{ padding: '0.75rem', background: applyMessage.includes('error') || applyMessage.includes('already') ? '#FEE2E2' : '#DCFCE7', color: applyMessage.includes('error') || applyMessage.includes('already') ? '#991B1B' : '#166534', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  {applyMessage}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Application</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowApplyModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Impact Dashboard ─── */
const ImpactDashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const id = user?._id || user?.gcId;
    if (!id) return;
    const fetchApps = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/applications/volunteer/${id}`);
        const data = await res.json();
        setApplications(data);
      } catch (e) { console.error(e); }
    };
    fetchApps();
  }, [user]);

  const completedApps = applications.filter(a => a.status === 'Approved' && a.programId?.status === 'Completed');
  const eventsAttended = completedApps.length;
  const hoursVolunteered = completedApps.reduce((acc, a) => acc + (a.programId?.hours || 0), 0);
  const badgesEarned = Math.floor(hoursVolunteered / 10) || 0;

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
          { icon: Clock, label: 'Hours Volunteered', value: hoursVolunteered.toString(), color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { icon: Award, label: 'Badges Earned', value: badgesEarned.toString(), color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { icon: Calendar, label: 'Events Attended', value: eventsAttended.toString(), color: 'var(--color-warning)', bg: 'rgba(0, 0, 0, 0.05)' }
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
          {completedApps.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No completed activities yet.</p>
          ) : completedApps.map((act, i) => (
            <div key={i} className="list-item">
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0 }}>{act.programId?.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>{act.ngoId?.name} · {new Date(act.updatedAt).toLocaleDateString()}</p>
              </div>
              <span className="badge badge-primary">+{act.programId?.hours} {language === 'KN' ? 'ಗಂಟೆಗಳು' : language === 'HI' ? 'घंटे' : 'hrs'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── NGO Directory View ─── */
const NgoDirectoryView = ({ onSelectNgo }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [ngos, setNgos] = useState([]);
  
  const getInitialDomain = () => {
    const interests = Array.isArray(user?.interests)
      ? user.interests
      : (typeof user?.interests === 'string' && user.interests ? [user.interests] : []);
    if (interests.length > 0) {
      return interests[0];
    }
    return 'All';
  };
  const [domainFilter, setDomainFilter] = useState(getInitialDomain());

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/ngos');
      const data = await res.json();
      setNgos(data);
    } catch (e) { console.error(e); }
  };

  const filtered = ngos.filter(ngo => {
    const matchesSearch = ngo.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (domainFilter === 'All') return matchesSearch;
    
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
              <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="My Interests">My Interests</option>
            )}
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Environment">{t('filter_env', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Education">{t('filter_edu', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Health">{t('filter_health', language)}</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Disaster Relief">Disaster Relief</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Animal Welfare">Animal Welfare</option>
            <option style={{ color: '#1E293B', background: '#FFFFFF' }} value="Rural Development">Rural Development</option>
          </select>
        </div>
      </div>

      <div className="grid grid-md-3">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
            No NGOs found for this domain.
          </div>
        ) : filtered.map(ngo => (
          <div 
            key={ngo._id} 
            className="glass-card card-hover" 
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => onSelectNgo(ngo)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.3, margin: 0 }}>{ngo.name}</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ngo.about || "This NGO is focused on making a profound impact in their dedicated domain."}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem', fontWeight: 600 }}>
              <Target size={14} /> Domain: {ngo.domain || 'N/A'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <MapPin size={14} /> {ngo.location || ngo.headquarters || 'Location not specified'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Volunteer NGO Profile View ─── */
const VolunteerNgoProfileView = ({ ngo, onBack }) => {
  const { language } = useLanguage();
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mediaGallery = ngo?.mediaGallery || [];

  return (
    <div className="animate-fade-in space-y-6">
      <button 
        onClick={onBack}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', background: 'var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* NGO Header (Impact Profile Style) */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', background: 'var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '3px solid white', boxShadow: 'var(--shadow-sm)', overflow: 'hidden'
          }}>
            {ngo?.profilePhoto ? (
              <img src={ngo.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={32} style={{ color: '#94A3B8' }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: 'var(--color-primary)' }}>
              {ngo?.name || 'NGO Name'}
            </h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              {ngo?.about || 'No about information provided.'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-primary">{ngo?.domain || 'Environment'}</span>
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
        </div>
      </div>

      {/* Impact Gallery (Read-Only) */}
      <h3 className="section-title" style={{ marginTop: '2rem' }}>Impact Gallery</h3>
      <div className="grid grid-md-3">
        {mediaGallery.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
            This NGO hasn't uploaded any impact gallery photos yet.
          </div>
        ) : mediaGallery.map((item, idx) => (
          <div key={item._id || idx} className="glass-card card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setSelectedGalleryItem(item); setActiveImageIndex(0); setIsGalleryModalOpen(true); }}>
            <div style={{ height: 160, background: 'var(--color-border)', position: 'relative' }}>
              {item.images && item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <Camera size={32} />
                </div>
              )}
              {item.images && item.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontWeight: 600 }}>
                  +{item.images.length - 1} photos
                </div>
              )}
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem', fontSize: '1rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Slideshow Modal (Read-Only) */}
      {isGalleryModalOpen && selectedGalleryItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          <button onClick={() => setIsGalleryModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#FFFFFF', border: 'none', color: '#334155', cursor: 'pointer', zIndex: 10, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <X size={20} />
          </button>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {selectedGalleryItem.images && selectedGalleryItem.images.length > 0 ? (
              <>
                <img src={selectedGalleryItem.images[activeImageIndex]} alt="Gallery Item" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                
                {selectedGalleryItem.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedGalleryItem.images.length - 1); }}
                      style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev < selectedGalleryItem.images.length - 1 ? prev + 1 : 0); }}
                      style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div style={{ color: 'white' }}>No images available</div>
            )}
          </div>

          <div style={{ marginTop: '2rem', color: 'white', maxWidth: 800, margin: '2rem auto 0', width: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{selectedGalleryItem.title}</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.9 }}>{selectedGalleryItem.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Volunteer Dashboard ─── */
const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('ngos');
  const [selectedNgoProfile, setSelectedNgoProfile] = useState(null);

  const tabs = [
    { id: 'ngos', label: 'NGO Directory' },
    { id: 'broadcasts', label: 'Broadcasts' },
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
            onClick={() => { setActiveTab(tab.id); setSelectedNgoProfile(null); }}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 400 }}>
        {activeTab === 'ngos' && (
          selectedNgoProfile ? (
            <VolunteerNgoProfileView ngo={selectedNgoProfile} onBack={() => setSelectedNgoProfile(null)} />
          ) : (
            <NgoDirectoryView onSelectNgo={setSelectedNgoProfile} />
          )
        )}
        {activeTab === 'broadcasts' && <DirectorySearch />}
        {activeTab === 'impact' && <ImpactDashboard />}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
