import React, { useState, useEffect } from 'react';
import { Search, MapPin, Target, ChevronRight, X, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CharitySearch = () => {
  const [ngos, setNgos] = campaigns => setCampaigns(campaigns);
  const [ngosList, setNgosList] = useState([]);
  const [searchParams, setSearchParams] = useState({ location: '', domain: '' });
  const [selectedNgo, setSelectedNgo] = useState(null);
  
  const [ngoCampaigns, setNgoCampaigns] = useState([]);
  const [ngoExpenses, setNgoExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const res = await fetch(`http://localhost:5000/api/users/ngos/search?${query}`);
      const data = await res.json();
      setNgosList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNgos();
  };

  const fetchNgoFinanceData = async (ngoId) => {
    try {
      const [campRes, expRes] = await Promise.all([
        fetch(`http://localhost:5000/api/finance/campaigns/${ngoId}`),
        fetch(`http://localhost:5000/api/finance/expenses/${ngoId}`)
      ]);
      setNgoCampaigns(await campRes.json());
      setNgoExpenses(await expRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectNgo = (ngo) => {
    setSelectedNgo(ngo);
    fetchNgoFinanceData(ngo._id);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Charity Search Engine</h1>
        <p>Find and verify NGOs. Transparently view their impact and financials before you donate.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Search Sidebar */}
        <div className="glass-card" style={{ flex: '1 1 300px', height: 'fit-content', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Filters</h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Mumbai" 
                  style={{ paddingLeft: '35px' }}
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Domain/Cause</label>
              <div style={{ position: 'relative' }}>
                <Target size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Education" 
                  style={{ paddingLeft: '35px' }}
                  value={searchParams.domain}
                  onChange={(e) => setSearchParams({...searchParams, domain: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Search size={16} /> Search
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <div style={{ flex: '3 1 600px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {ngosList.map(ngo => (
              <div key={ngo._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => handleSelectNgo(ngo)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {ngo.profilePhoto ? (
                    <img src={ngo.profilePhoto} alt={ngo.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {ngo.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{ngo.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)' }}>{ngo.domain || 'General'}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748B', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ngo.about || 'No description available.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14}/> {ngo.headquarters || 'Unknown'}
                  </span>
                  <ChevronRight size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>
            ))}
            {ngosList.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                No NGOs found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NGO Transparent Profile Modal */}
      {selectedNgo && (
        <div className="modal-overlay" onClick={() => setSelectedNgo(null)} style={{ zIndex: 100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <button className="icon-btn" onClick={() => setSelectedNgo(null)} style={{ marginLeft: 'auto' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              {selectedNgo.profilePhoto ? (
                <img src={selectedNgo.profilePhoto} alt={selectedNgo.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  {selectedNgo.name?.charAt(0)}
                </div>
              )}
              <div>
                <h1 style={{ margin: 0 }}>{selectedNgo.name}</h1>
                <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> {selectedNgo.headquarters} | <Target size={16} /> {selectedNgo.domain}
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0 }}>About</h3>
              <p style={{ lineHeight: 1.6, color: '#334155' }}>{selectedNgo.about || 'No details provided.'}</p>
            </div>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <IndianRupee size={20} style={{ color: 'var(--color-primary)' }} /> Financial Transparency Report
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Active Campaigns */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Active Campaigns</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ngoCampaigns.map(c => (
                    <div key={c._id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
                      <h5 style={{ margin: '0 0 0.5rem 0' }}>{c.title}</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <span>Raised: ₹{c.raisedAmount}</span>
                        <span>Goal: ₹{c.targetAmount}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min((c.raisedAmount/c.targetAmount)*100, 100)}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                      </div>
                    </div>
                  ))}
                  {ngoCampaigns.length === 0 && <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>No active campaigns.</p>}
                </div>
              </div>

              {/* Recent Expenses */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Recent Expense Logs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ngoExpenses.slice(0, 5).map(e => (
                    <div key={e._id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 0.25rem 0' }}>{e.title}</h5>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>{new Date(e.date).toLocaleDateString()} &bull; {e.category}</p>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#EF4444' }}>- ₹{e.amountSpent}</span>
                    </div>
                  ))}
                  {ngoExpenses.length === 0 && <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>No expenses logged.</p>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                alert('In a full version, this would prompt you to pledge a donation.');
              }}>
                Pledge Support
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/messages', { state: { contactId: selectedNgo.gcId, contactName: selectedNgo.name } })}>
                Message {selectedNgo.pocName || 'NGO'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CharitySearch;
