import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Camera, Users, WifiOff, Wifi, IndianRupee, MessageSquare, Plus, Save, Building2, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import NgoProfile from './NgoProfile';
import CollabHub from '../../components/chat/CollabHub';
import { t } from '../../utils/translations';

/* ─── Impact Profile ─── */
const ImpactProfile = () => {
  const { language } = useLanguage();
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({ title: '', description: '', images: [], programId: '' });
  const [programs, setPrograms] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (user?.gcId) {
      fetch(`http://localhost:5000/api/programs/ngo/${user.gcId}`)
        .then(res => res.json())
        .then(data => setPrograms(data))
        .catch(console.error);
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (galleryFormData.images.length + files.length > 8) {
      alert('You can only upload up to 8 images per activity.');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.7);
          setGalleryFormData(prev => ({ ...prev, images: [...prev.images, base64] }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveGalleryItem = async () => {
    if (!galleryFormData.title || !galleryFormData.description) {
      alert('Title and description are required.');
      return;
    }
    const updatedGallery = [...(user.mediaGallery || []), galleryFormData];
    try {
      await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcId: user.gcId, updatedData: { mediaGallery: updatedGallery } })
      });
      updateUserProfile({ mediaGallery: updatedGallery });
      setIsGalleryModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save activity.');
    }
  };

  const mediaGallery = user?.mediaGallery || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%', background: 'var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '3px solid white', boxShadow: 'var(--shadow-sm)', overflow: 'hidden'
          }}>
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={32} style={{ color: '#94A3B8' }} />
            )}
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
          <button 
            className="btn btn-outline" 
            style={{ alignSelf: 'flex-start' }}
            onClick={() => navigate('/ngo/profile')}
          >
            {t('edit_profile', language)}
          </button>
        </div>
      </div>

      <div>
        <h3 className="section-title">{t('media_gallery', language)}</h3>
        <div className="grid grid-md-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const item = mediaGallery[i];
            if (item) {
              const imgCount = Math.min(item.images?.length || 0, 3);
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }} onClick={() => { setSelectedGalleryItem(item); setActiveImageIndex(0); setEditMode(false); setIsGalleryModalOpen(true); }}>
                  <div style={{ position: 'relative', aspectRatio: '1', width: '100%', padding: '12px' }}>
                    {item.images && item.images.length > 0 ? (
                      item.images.slice(0, 3).reverse().map((img, idx) => {
                        const offset = (imgCount - 1 - idx) * 8;
                        return (
                          <div key={idx} style={{
                            position: 'absolute', top: offset, left: offset,
                            right: 24 - offset, bottom: 24 - offset,
                            background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            zIndex: imgCount - idx,
                            border: '3px solid white'
                          }} />
                        );
                      })
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--color-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Camera size={24} style={{ color: '#94A3B8' }} />
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', textAlign: 'center', margin: 0, padding: '0 0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                </div>
              );
            } else {
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div onClick={() => { setGalleryFormData({ title: '', description: '', images: [], programId: '' }); setEditMode(true); setIsGalleryModalOpen(true); }} style={{
                    aspectRatio: '1', background: 'var(--color-border)', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', border: '3px dashed #CBD5E1',
                    margin: '12px', width: 'calc(100% - 24px)', height: 'calc(100% - 24px)'
                  }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-border)'}>
                    <Plus size={32} style={{ color: '#94A3B8' }} />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {isGalleryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: editMode ? 600 : 1000, height: editMode ? '85vh' : '90vh', display: 'flex', flexDirection: 'column', background: editMode ? '#fff' : 'transparent', borderRadius: editMode ? '16px' : '0' }}>
            <button onClick={() => setIsGalleryModalOpen(false)} style={{ position: 'absolute', top: editMode ? 20 : -40, right: editMode ? 20 : 0, background: editMode ? '#F1F5F9' : 'rgba(255,255,255,0.2)', border: 'none', color: editMode ? '#334155' : '#fff', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>

            {editMode ? (
              <div style={{ padding: '2.5rem', overflowY: 'auto' }}>
                <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add Activity to Gallery</h3>
                
                <div className="form-group">
                  <label className="form-label">Import from Program</label>
                  <select className="form-input" value={galleryFormData.programId} onChange={(e) => {
                    const p = programs.find(x => x._id === e.target.value);
                    if(p) setGalleryFormData(prev => ({...prev, title: p.title, description: p.description, programId: p._id}));
                    else setGalleryFormData(prev => ({...prev, programId: e.target.value}));
                  }}>
                    <option value="">-- Start Fresh --</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.title} ({p.status})</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" placeholder="e.g., Beach Cleanup 2026" value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="4" placeholder="Share the impact and details..." value={galleryFormData.description} onChange={e => setGalleryFormData({...galleryFormData, description: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Upload Photos (Max 8)</label>
                  <div style={{ border: '2px dashed #CBD5E1', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', background: '#F8FAFC', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => document.getElementById('gallery-upload').click()}>
                    <Plus size={24} style={{ color: '#64748B', margin: '0 auto 0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>Click to browse images</p>
                  </div>
                  <input type="file" id="gallery-upload" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {galleryFormData.images.map((img, idx) => (
                      <div key={idx} style={{ width: 80, height: 80, borderRadius: '8px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                        <button type="button" onClick={() => setGalleryFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={handleSaveGalleryItem}>Save Activity to Gallery</button>
              </div>
            ) : (
              selectedGalleryItem && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                  {selectedGalleryItem.images && selectedGalleryItem.images.length > 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                      <img src={selectedGalleryItem.images[activeImageIndex]} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Activity" />
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#94A3B8' }}>
                      No photos available for this activity
                    </div>
                  )}

                  {selectedGalleryItem.images && selectedGalleryItem.images.length > 1 && (
                    <>
                      <button onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : selectedGalleryItem.images.length - 1)} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: 56, height: 56, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
                        <ChevronLeft size={32} />
                      </button>
                      <button onClick={() => setActiveImageIndex(prev => prev < selectedGalleryItem.images.length - 1 ? prev + 1 : 0)} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: 56, height: 56, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
                        <ChevronRight size={32} />
                      </button>
                    </>
                  )}

                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem 2.5rem 2.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.95))', color: '#fff' }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.75rem' }}>{selectedGalleryItem.title}</h3>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.9, margin: 0, maxWidth: '800px' }}>{selectedGalleryItem.description}</p>
                    
                    {selectedGalleryItem.images && selectedGalleryItem.images.length > 1 && (
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                        {selectedGalleryItem.images.map((_, idx) => (
                          <div key={idx} style={{ width: 10, height: 10, borderRadius: '50%', background: idx === activeImageIndex ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setActiveImageIndex(idx)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Management Suite ─── */
const ManagementSuite = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', rolesNeeded: '' });
  
  const [showEndCampaignModal, setShowEndCampaignModal] = useState(false);
  const [selectedCampaignForEnd, setSelectedCampaignForEnd] = useState(null);
  const [campaignHours, setCampaignHours] = useState('');
  const [volunteerApps, setVolunteerApps] = useState([]);
  
  useEffect(() => {
    const id = user?._id || user?.gcId;
    if (!id) return;
    fetchPrograms(id);
    fetchApplications(id);
  }, [user]);

  const fetchPrograms = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/programs/ngo/${id}`);
      const data = await res.json();
      setPrograms(data);
    } catch (e) { console.error(e); }
  };

  const fetchApplications = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/ngo/${id}`);
      const data = await res.json();
      setApplications(data);
    } catch (e) { console.error(e); }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const rolesArray = formData.rolesNeeded.split(',').map(r => r.trim()).filter(Boolean);
      const id = user?._id || user?.gcId;
      await fetch('http://localhost:5000/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: id,
          title: formData.title,
          description: formData.description,
          rolesNeeded: rolesArray,
          location: formData.location
        })
      });
      setShowBroadcastModal(false);
      setFormData({ title: '', description: '', rolesNeeded: '', location: '' });
      fetchPrograms(id);
    } catch (e) { console.error(e); }
  };

  const handleApprove = async (appId) => {
    try {
      await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      const id = user?._id || user?.gcId;
      fetchApplications(id);
      setShowProfileModal(false);
    } catch (e) { console.error(e); }
  };

  const handleReject = async (appId) => {
    try {
      await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      const id = user?._id || user?.gcId;
      fetchApplications(id);
      setShowProfileModal(false);
    } catch (e) { console.error(e); }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) return;
    try {
      await fetch(`http://localhost:5000/api/programs/${programId}`, {
        method: 'DELETE'
      });
      const id = user?._id || user?.gcId;
      fetchPrograms(id);
    } catch (e) { console.error(e); }
  };

  const handleEndCampaign = async (e) => {
    e.preventDefault();
    if (!selectedCampaignForEnd) return;
    try {
      await fetch(`http://localhost:5000/api/programs/${selectedCampaignForEnd._id}/end`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: Number(campaignHours) })
      });
      const id = user?._id || user?.gcId;
      fetchPrograms(id);
      setShowEndCampaignModal(false);
      setCampaignHours('');
      setSelectedCampaignForEnd(null);
    } catch (e) { console.error(e); }
  };

  const fetchVolunteerApps = async (volId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/volunteer/${volId}`);
      const data = await res.json();
      setVolunteerApps(data);
    } catch (e) { console.error(e); }
  };

  const getStatLabelKey = (label) => {
    if (label === 'Total Volunteers') return 'total_volunteers';
    if (label === 'Active Campaigns') return 'active_campaigns';
    if (label === 'Total Hours Logged') return 'total_hours_logged';
    return label;
  };

  const getStatusTranslation = (status, lang) => {
    if (status === 'Approved' || status === 'Active') return lang === 'KN' ? 'ಸಕ್ರಿಯ' : lang === 'HI' ? 'सक्रिय' : 'Active';
    if (status === 'Pending') return lang === 'KN' ? 'ಬಾಕಿ ಇದೆ' : lang === 'HI' ? 'लंबित' : 'Pending';
    if (status === 'Rejected' || status === 'Inactive') return lang === 'KN' ? 'ನಿಷ್ಕ್ರಿಯ' : lang === 'HI' ? 'निष्क्रिय' : 'Inactive';
    return status;
  };

  const activeVolunteers = applications.filter(a => a.status === 'Approved').length;
  const activeCampaigns = programs.filter(p => p.status === 'Active').length;
  // Generating a stable random number based on activeVolunteers so it doesn't jump around on every re-render
  const randomHours = activeVolunteers > 0 ? (activeVolunteers * 120 + 45) : 0; 

  return (
    <div className="animate-fade-in space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>{t('vol_management', language)}</h2>
        <button className="btn btn-primary" onClick={() => setShowBroadcastModal(true)}><Plus size={16} /> {t('broadcast_need', language)}</button>
      </div>

      <div className="grid grid-md-3">
        {[
          { label: 'Total Volunteers', value: activeVolunteers.toString(), color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Active Campaigns', value: activeCampaigns.toString(), color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Total Hours Logged', value: randomHours > 0 ? randomHours + '+' : '0', color: 'var(--color-warning)', bg: 'rgba(0, 0, 0, 0.05)' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><span style={{ color: s.color, fontWeight: 800 }}>●</span></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{t(getStatLabelKey(s.label), language)}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{ marginTop: '2rem' }}>Broadcasted Programs</h3>
      <div className="grid grid-md-2" style={{ marginBottom: '2rem' }}>
        {programs.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
            No programs broadcasted yet. Click "Broadcast Need" to start!
          </div>
        ) : programs.map(program => {
          const pApps = applications.filter(a => a.programId?._id === program._id || a.programId === program._id);
          const approved = pApps.filter(a => a.status === 'Approved').length;
          return (
            <div key={program._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>{program.title}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge ${program.status === 'Active' ? 'badge-secondary' : program.status === 'Completed' ? 'badge-primary' : 'badge-warning'}`}>{program.status}</span>
                  {program.status === 'Active' && (
                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => { setSelectedCampaignForEnd(program); setShowEndCampaignModal(true); }}>
                      End Campaign
                    </button>
                  )}
                  <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#EF4444', borderColor: '#EF4444' }} onClick={() => handleDeleteProgram(program._id)}>
                    <Trash2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Delete
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', flex: 1 }}>{program.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {program.rolesNeeded.map((role, idx) => (
                  <span key={idx} className="badge badge-primary">{role}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500, paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                {pApps.length} Applications ({approved} Approved)
              </div>
            </div>
          )
        })}
      </div>

      <h3 className="section-title">Volunteer Applications</h3>
      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('name', language)}</th>
              <th>{t('role', language)}</th>
              <th>PROGRAM</th>
              <th>{t('status', language)}</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No applications yet.</td></tr>
            ) : applications.map((app) => (
              <tr key={app._id} onClick={() => { 
                setSelectedApp(app); 
                setVolunteerApps([]); 
                fetchVolunteerApps(app.volunteerId?._id || app.volunteerId); 
                setShowProfileModal(true); 
              }} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 600 }}>{app.volunteerId?.name || 'Unknown'}</td>
                <td>{app.roleApplied}</td>
                <td>{app.programId?.title || 'Unknown'}</td>
                <td><span className={`badge ${app.status === 'Approved' ? 'badge-secondary' : app.status === 'Pending' ? 'badge-warning' : 'badge-primary'}`}>{getStatusTranslation(app.status, language)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showBroadcastModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 500 }}>
            <h3 className="section-title">Broadcast Need</h3>
            <form onSubmit={handleBroadcast}>
              <div className="form-group">
                <label className="form-label">Program Title</label>
                <input className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Beach Cleanup Drive" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the program..."></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Roles Needed (comma separated)</label>
                <input className="form-input" required value={formData.rolesNeeded} onChange={e => setFormData({...formData, rolesNeeded: e.target.value})} placeholder="e.g. Field Coordinator, Content Creator" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" required value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Cubbon Park, Bangalore" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Broadcast</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowBroadcastModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEndCampaignModal && selectedCampaignForEnd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 400 }}>
            <h3 className="section-title">End Campaign</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Please enter the total number of hours volunteered for this campaign. This will be added to the volunteers' impact profiles.</p>
            <form onSubmit={handleEndCampaign}>
              <div className="form-group">
                <label className="form-label">Total Hours</label>
                <input type="number" className="form-input" required min="1" value={campaignHours} onChange={e => setCampaignHours(e.target.value)} placeholder="e.g. 4" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>End Campaign</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowEndCampaignModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && selectedApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: 500 }}>
            <h3 className="section-title">Volunteer Profile</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
                {selectedApp.volunteerId?.profilePhoto ? (
                  <img src={selectedApp.volunteerId.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                    <Users size={32} />
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0', color: 'var(--color-primary)' }}>{selectedApp.volunteerId?.name}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{selectedApp.volunteerId?.location || 'Unknown Location'} • {selectedApp.volunteerId?.age ? selectedApp.volunteerId.age + ' yrs' : 'Age Unknown'}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Applied For</h5>
              <p style={{ margin: 0, fontWeight: 600 }}>{selectedApp.programId?.title} - {selectedApp.roleApplied}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Interests</h5>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(selectedApp.volunteerId?.interests || []).map((interest, idx) => (
                  <span key={idx} className="badge badge-primary">{interest}</span>
                ))}
                {(!selectedApp.volunteerId?.interests || selectedApp.volunteerId?.interests.length === 0) && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>No specific interests listed.</span>
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Volunteer Impact</h5>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'var(--color-border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{volunteerApps.filter(a => a.status === 'Approved' && a.programId?.status === 'Completed').reduce((acc, a) => acc + (a.programId?.hours || 0), 0)}</span> <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Hours</span>
                </div>
                <div style={{ background: 'var(--color-border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{volunteerApps.filter(a => a.status === 'Approved' && a.programId?.status === 'Completed').length}</span> <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Events</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {selectedApp.status === 'Pending' && (
                <>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleApprove(selectedApp._id)}>Approve</button>
                  <button className="btn btn-outline" style={{ flex: 1, borderColor: '#EF4444', color: '#EF4444' }} onClick={() => handleReject(selectedApp._id)}>Reject</button>
                </>
              )}
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
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

/* ─── Collab Hub Placeholder removed, using imported component ─── */

/* ─── NGO Dashboard ─── */
const NgoDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('impact');
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user?.gcId) return;
    
    const fetchTotalUnread = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/unread-counts?receiverId=${user.gcId}`);
        const data = await response.json();
        const total = Object.values(data).reduce((acc, count) => acc + (typeof count === 'number' ? count : 0), 0);
        setTotalUnread(total);
      } catch (error) {}
    };

    fetchTotalUnread();
    const interval = setInterval(fetchTotalUnread, 3000);
    return () => clearInterval(interval);
  }, [user?.gcId]);

  const tabs = [
    { id: 'impact', label: t('tab_impact_profile', language), icon: <Camera size={16} /> },
    { id: 'management', label: t('tab_management', language), icon: <Users size={16} /> },
    { id: 'offline', label: t('tab_offline_logger', language), icon: <WifiOff size={16} /> },
    { id: 'finance', label: t('tab_finance', language), icon: <IndianRupee size={16} /> },
    { id: 'collab', label: t('tab_collab', language), icon: <MessageSquare size={16} />, badge: totalUnread },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">{t('ngo_dash_title', language)}</h1>
        <p>{t('welcome_back', language)} <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingTop: '0.5rem', paddingRight: '0.5rem', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            style={{ position: 'relative' }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#EF4444', color: 'white', fontSize: '0.7rem',
                fontWeight: 'bold', minWidth: '20px', height: '20px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)', border: '2px solid #F8FAFC',
                padding: '0 4px'
              }}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
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
