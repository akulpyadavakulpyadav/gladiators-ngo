import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Target, IndianRupee, FileText, Download, ChevronLeft, MessageSquare } from 'lucide-react';

const CompanyNgoProfile = () => {
  const { ngoId } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        // Fetch NGO details (using search with ID or assuming we have a direct endpoint, 
        // we'll filter from search for demo since we didn't add a specific GET /users/:id earlier)
        const userRes = await fetch(`http://localhost:5000/api/users/ngos/search`);
        const allNgos = await userRes.json();
        const foundNgo = allNgos.find(n => n._id === ngoId);
        
        if (foundNgo) setNgo(foundNgo);

        // Fetch Finance Data
        const [campRes, expRes] = await Promise.all([
          fetch(`http://localhost:5000/api/finance/campaigns/${ngoId}`),
          fetch(`http://localhost:5000/api/finance/expenses/${ngoId}`)
        ]);
        
        setCampaigns(await campRes.json());
        setExpenses(await expRes.json());
        
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
          </div>
        </div>
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.75rem' }}>
        <IndianRupee size={28} style={{ color: 'var(--color-primary)' }} /> Financial Transparency & Reports
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Campaigns & Finance Reports */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} /> Campaigns & Reports
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
            {campaigns.length === 0 && <p style={{ color: '#94A3B8' }}>No campaigns available.</p>}
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
    </div>
  );
};

export default CompanyNgoProfile;
