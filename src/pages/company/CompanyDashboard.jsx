import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IndianRupee, FileText, CheckCircle, Target, TrendingUp } from 'lucide-react';

/* ─── Funding Portal ─── */
const FundingPortal = () => (
  <div className="animate-fade-in space-y-6">
    <div className="grid grid-md-3">
      {[
        { label: 'Total Budget Allocated', value: '₹ 50.0L', color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
        { label: 'Funds Disbursed', value: '₹ 32.5L', color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
        { label: 'Active Partnerships', value: '4 NGOs', color: 'var(--color-text-primary)', bg: 'rgba(0, 0, 0, 0.05)' }
      ].map((s, i) => (
        <div key={i} className="stat-card" style={{ textAlign: 'left' }}>
          <div className="stat-label" style={{ marginBottom: '0.5rem' }}>{s.label}</div>
          <div className="stat-value" style={{ color: s.color, fontSize: '1.75rem', textAlign: 'left' }}>{s.value}</div>
        </div>
      ))}
    </div>

    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 className="section-title">Active Funding Campaigns</h3>
      <div className="space-y-4">
        {[
          { ngo: 'Global Green Initiative', amount: '₹ 12.0L', status: 'On Track', progress: 80, done: false },
          { ngo: 'EduCare Foundation', amount: '₹ 8.5L', status: 'Pending Review', progress: 40, done: false },
          { ngo: 'OceanSavers Network', amount: '₹ 12.0L', status: 'Completed', progress: 100, done: true }
        ].map((camp, i) => (
          <div key={i} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem', margin: 0 }}>{camp.ngo}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0' }}>{camp.amount} Allocated</p>
              </div>
              <span className={`badge ${camp.done ? 'badge-secondary' : 'badge-primary'}`}>{camp.status}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ 
                width: `${camp.progress}%`, 
                background: camp.done 
                  ? 'var(--color-secondary)' 
                  : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))' 
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Due Diligence ─── */
const DueDiligence = () => (
  <div className="animate-fade-in glass-card" style={{ padding: '1.5rem' }}>
    <h3 className="section-title">NGO Verification Status</h3>
    <div className="space-y-4">
      {[
        { ngo: 'Global Green Initiative', status: 'Verified', date: 'Aug 2024' },
        { ngo: 'EduCare Foundation', status: 'Verified', date: 'Jul 2024' },
        { ngo: 'HealthFirst NGO', status: 'Pending', date: 'Action Required' }
      ].map((item, i) => (
        <div key={i} className="list-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: item.status === 'Verified' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {item.status === 'Verified'
                ? <CheckCircle size={18} style={{ color: 'var(--color-secondary)' }} />
                : <Target size={18} style={{ color: 'var(--color-warning)' }} />}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0 }}>{item.ngo}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>Last audit: {item.date}</p>
            </div>
          </div>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>View Docs</button>
        </div>
      ))}
    </div>
  </div>
);

/* ─── CSR Reports ─── */
const CsrReports = () => (
  <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
    }}>
      <FileText size={32} style={{ color: 'var(--color-primary)' }} />
    </div>
    <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Impact & CSR Reports</h2>
    <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
      Generate comprehensive, transparent reports formatted for compliance and stakeholder reviews.
    </p>
    <button className="btn btn-primary"><TrendingUp size={16} /> Generate Q3 Report</button>
  </div>
);

/* ─── Company Dashboard ─── */
const CompanyDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('funding');

  const tabs = [
    { id: 'funding', label: 'Funding Portal' },
    { id: 'diligence', label: 'Due Diligence' },
    { id: 'reports', label: 'CSR Reports' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">Corporate Funder Portal</h1>
        <p>Manage CSR impact, <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
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
        {activeTab === 'funding' && <FundingPortal />}
        {activeTab === 'diligence' && <DueDiligence />}
        {activeTab === 'reports' && <CsrReports />}
      </div>
    </div>
  );
};

export default CompanyDashboard;
