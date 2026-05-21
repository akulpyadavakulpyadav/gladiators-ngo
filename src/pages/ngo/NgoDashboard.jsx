import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Users, WifiOff, Wifi, IndianRupee, MessageSquare, Plus, Save } from 'lucide-react';

/* ─── Impact Profile ─── */
const ImpactProfile = () => (
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
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: 'var(--color-primary)' }}>Global Green Initiative</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
            Dedicated to SDG 13 (Climate Action) and SDG 17 (Partnerships) through community-driven afforestation and awareness programs.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">Environment</span>
            <span className="badge badge-secondary">Verified</span>
          </div>
        </div>
        <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Edit Profile</button>
      </div>
    </div>

    <div>
      <h3 className="section-title">Media Gallery</h3>
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

/* ─── Management Suite ─── */
const ManagementSuite = () => (
  <div className="animate-fade-in space-y-6">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 className="section-title" style={{ marginBottom: 0 }}>Volunteer Management</h2>
      <button className="btn btn-primary"><Plus size={16} /> Broadcast Need</button>
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
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Hours</th>
            <th>Status</th>
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
              <td>{v.role}</td>
              <td>{v.hours} hrs</td>
              <td><span className={`badge ${v.status === 'Active' ? 'badge-secondary' : 'badge-warning'}`}>{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Offline Event Logger ─── */
const OfflineEventLogger = () => {
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
          <h3 className="section-title" style={{ marginBottom: 0 }}>Log New Event</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isOnline ? <Wifi size={14} style={{ color: 'var(--color-secondary)' }} /> : <WifiOff size={14} style={{ color: 'var(--color-warning)' }} />}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOnline ? 'var(--color-secondary)' : 'var(--color-warning)' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input type="text" className="form-input" placeholder="e.g. Beach Cleanup Drive" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" placeholder="e.g. Bangalore" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Number of Attendees</label>
            <input type="number" className="form-input" placeholder="0" required value={formData.attendees} onChange={e => setFormData({...formData, attendees: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}><Save size={16} /> Save Event</button>
        </form>
      </div>

      {/* Event List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>Event Logs</h3>
          {isOnline && unsyncedCount > 0 && (
            <button onClick={handleSync} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              Sync {unsyncedCount} items
            </button>
          )}
        </div>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' }}>No events logged yet.</p>
        ) : (
          <div className="space-y-4" style={{ maxHeight: 380, overflowY: 'auto' }}>
            {events.map(ev => (
              <div key={ev.id} className="list-item">
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{ev.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{ev.location} · {ev.attendees} attendees</p>
                </div>
                <span className={`badge ${ev.synced ? 'badge-secondary' : 'badge-warning'}`}>{ev.synced ? 'Synced' : 'Pending'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Finance Suite ─── */
const FinanceSuite = () => (
  <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
    <div style={{ 
      width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
    }}>
      <IndianRupee size={32} style={{ color: 'var(--color-secondary)' }} />
    </div>
    <h2 className="text-gradient-secondary" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Finance & Transparency</h2>
    <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
      Track expenses, generate transparency reports for corporate funders, and manage CSR budgets securely.
    </p>
    <button className="btn btn-secondary">Generate New Report</button>
  </div>
);

/* ─── Collab Hub ─── */
const CollabHub = () => (
  <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
    <div style={{ 
      width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
    }}>
      <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
    </div>
    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>NGO Collab Hub</h2>
    <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
      Connect with other verified NGOs to host joint events and pool resources for larger impact.
    </p>
    <button className="btn btn-primary">Explore Partnerships</button>
  </div>
);

/* ─── NGO Dashboard ─── */
const NgoDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('impact');

  const tabs = [
    { id: 'impact', label: 'Impact Profile', icon: <Camera size={16} /> },
    { id: 'management', label: 'Management', icon: <Users size={16} /> },
    { id: 'offline', label: 'Offline Logger', icon: <WifiOff size={16} /> },
    { id: 'finance', label: 'Finance', icon: <IndianRupee size={16} /> },
    { id: 'collab', label: 'Collab Hub', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">NGO Dashboard</h1>
        <p>Welcome back, <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
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
