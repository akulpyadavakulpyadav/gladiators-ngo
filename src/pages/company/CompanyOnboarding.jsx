import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigilockerMock from '../../components/DigilockerMock';
import { Briefcase } from 'lucide-react';

const CompanyOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', budget: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDigilockerSuccess = () => setStep(2);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'company', name: formData.name, id: 'comp_' + Math.random().toString(36).substr(2, 9), budget: formData.budget });
    navigate('/company/dashboard');
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 0' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(30, 41, 59, 0.06)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
        }}>
          <Briefcase size={28} style={{ color: 'var(--color-text-primary)' }} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Corporate Funder Registration</h1>
        <p style={{ fontSize: '0.95rem' }}>Fund verified NGOs and track your CSR impact transparently.</p>
      </div>

      {step === 1 ? (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 1 — Corporate Entity Verification</span>
          </div>
          <DigilockerMock entityType="company" onVerify={handleDigilockerSuccess} />
        </div>
      ) : (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 2 — CSR Details</span>
          </div>
          <form onSubmit={handleFinalSubmit}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-input" placeholder="e.g. Tata Consultancy Services" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">CSR Contact Email</label>
              <input type="email" className="form-input" placeholder="csr@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Annual CSR Budget (INR)</label>
              <input type="number" className="form-input" placeholder="e.g. 10000000" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Access CSR Portal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyOnboarding;
