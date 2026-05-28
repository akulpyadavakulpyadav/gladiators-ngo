import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Target, IndianRupee, FileText, Download, ChevronLeft, MessageSquare, Users, Clock, Activity, Camera, X, ChevronRight } from 'lucide-react';

const CompanyNgoProfile = () => {
  const { ngoId } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [ngoStats, setNgoStats] = useState({ volunteers: 0, hours: 0, campaigns: 0, activeCampaigns: 0, endedCampaigns: 0 });

  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        // Fetch NGO details (using search with ID or assuming we have a direct endpoint, 
        // we'll filter from search for demo since we didn't add a specific GET /users/:id earlier)
        const userRes = await fetch(`http://localhost:5000/api/users/ngos/search`);
        const allNgos = await userRes.json();
        const foundNgo = allNgos.find(n => n._id === ngoId);
        
        if (foundNgo) setNgo(foundNgo);

        // Fetch Finance, Program Data & Stats
        const [campRes, expRes, progRes, statsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/finance/campaigns/${ngoId}`),
          fetch(`http://localhost:5000/api/finance/expenses/${ngoId}`),
          fetch(`http://localhost:5000/api/programs/ngo/${ngoId}`),
          fetch(`http://localhost:5000/api/users/ngos/${ngoId}/stats`)
        ]);
        
        setCampaigns(await campRes.json());
        setExpenses(await expRes.json());
        setPrograms(await progRes.json());
        if (statsRes.ok) setNgoStats(await statsRes.json());
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNgoData();
  }, [ngoId]);

  if (loading) return <div className="page-container text-center">Loading NGO profile...</div>;
  if (!ngo) return <div className="page-container text-center">NGO not found.</div>;

  return (
    <div className="page-container animate-fade-in">
      <button className="btn btn-outline" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/company/search')}>
        <ChevronLeft size={16} /> Back to Search
      </button>

      <div className="glass-card" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
          {ngo.profilePhoto ? (
            <img src={ngo.profilePhoto} alt={ngo.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
              {ngo.name?.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{ngo.name}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#64748B', marginBottom: '1.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {ngo.headquarters || 'Unknown Location'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={18} /> {ngo.domain || 'General Cause'}</span>
            </div>
            <p style={{ lineHeight: 1.7, color: '#334155', fontSize: '1.1rem' }}>{ngo.about || 'No details provided.'}</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={() => alert('Pledge flow would start here.')}>
                Pledge Support
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/messages', { state: { contactId: ngo._id, contactName: ngo.name } })} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} /> Direct Connect
              </button>
            </div>

            {/* Impact Stats */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px dashed #E2E8F0', paddingTop: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 120px', textAlign: 'center', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Users size={20} style={{ color: 'var(--color-secondary)', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{ngoStats.volunteers}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Volunteers</div>
              </div>
              <div style={{ flex: '1 1 120px', textAlign: 'center', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Clock size={20} style={{ color: 'var(--color-secondary)', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{ngoStats.hours}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Hours Logged</div>
              </div>
              <div style={{ flex: '1 1 120px', textAlign: 'center', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Activity size={20} style={{ color: '#3B82F6', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{ngoStats.activeCampaigns}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Active Campaigns</div>
              </div>
              <div style={{ flex: '1 1 120px', textAlign: 'center', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Activity size={20} style={{ color: '#94A3B8', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{ngoStats.endedCampaigns}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Ended Campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
        <Camera size={28} style={{ color: 'var(--color-primary)' }} /> Impact Gallery
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {ngo.mediaGallery?.length > 0 ? (
          ngo.mediaGallery.map((item, idx) => (
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
          ))
        ) : (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
            No impact photos available yet.
          </div>
        )}
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
        <IndianRupee size={28} style={{ color: 'var(--color-primary)' }} /> Financial Transparency & Reports
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Campaigns & Volunteer Programs */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} /> Campaigns & Volunteer Programs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {campaigns.map(c => (
              <div key={c._id} style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${c.status === 'Completed' ? '#10B981' : 'var(--color-primary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{c.title}</h4>
                  <span className={`badge ${c.status === 'Completed' ? 'badge-secondary' : 'badge-primary'}`}>{c.status}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748B' }}>
                  <span>Raised: ₹{c.raisedAmount.toLocaleString()}</span>
                  <span>Goal: ₹{c.targetAmount.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%`, height: '100%', background: c.status === 'Completed' ? '#10B981' : 'var(--color-primary)' }}></div>
                </div>

                {c.status === 'Completed' && c.hasFinanceReport && (
                  <button className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => alert(`Downloading ${c.financeReportUrl}`)}>
                    <Download size={16} /> Download Finance Report
                  </button>
                )}
                {c.status === 'Completed' && !c.hasFinanceReport && (
                  <div style={{ fontSize: '0.85rem', color: '#F59E0B', background: '#FEF3C7', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                    Finance Report Pending
                  </div>
                )}
              </div>
            ))}
            {programs.map(p => (
              <div key={p._id} style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${p.status === 'Completed' ? '#10B981' : 'var(--color-secondary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{p.title}</h4>
                  <span className={`badge ${p.status === 'Completed' ? 'badge-secondary' : 'badge-primary'}`}>{p.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {p.rolesNeeded?.map((role, i) => (
                    <span key={i} className="badge badge-primary" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>{role}</span>
                  ))}
                </div>
              </div>
            ))}
            {campaigns.length === 0 && programs.length === 0 && <p style={{ color: '#94A3B8' }}>No campaigns or programs available.</p>}
          </div>
        </div>

        {/* Detailed Expense Logs */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1E293B' }}>Recent Expense Logs</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Live feed of exactly how funds are being utilized.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {expenses.map(e => (
              <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{e.title}</h5>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>{e.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{new Date(e.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#EF4444', fontSize: '1.1rem' }}>- ₹{e.amountSpent.toLocaleString()}</div>
                  {e.proofUrl && <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>View Receipt</a>}
                </div>
              </div>
            ))}
            {expenses.length === 0 && <p style={{ color: '#94A3B8' }}>No expenses logged yet.</p>}
          </div>
        </div>
        
      </div>

      {/* Gallery Slideshow Modal */}
      {isGalleryModalOpen && selectedGalleryItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {selectedGalleryItem.images && selectedGalleryItem.images.length > 0 ? (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '100%', maxHeight: '100%' }}>
                <button onClick={() => setIsGalleryModalOpen(false)} style={{ marginBottom: '1rem', background: '#FFFFFF', border: 'none', color: '#334155', cursor: 'pointer', zIndex: 10, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', flexShrink: 0 }}>
                  <X size={20} />
                </button>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
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
                </div>
              </div>
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

export default CompanyNgoProfile;
