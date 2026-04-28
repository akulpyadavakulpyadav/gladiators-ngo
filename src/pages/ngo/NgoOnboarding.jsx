import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigilockerMock from '../../components/DigilockerMock';
import { Building2 } from 'lucide-react';

const NgoOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', domain: 'SDG 16: Peace & Justice' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDigilockerSuccess = () => setStep(2);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'ngo', name: formData.name, id: 'ngo_' + Math.random().toString(36).substr(2, 9), domain: formData.domain });
    navigate('/ngo/dashboard');
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 0' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(26, 82, 118, 0.08)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
        }}>
          <Building2 size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>NGO Registration</h1>
        <p style={{ fontSize: '0.95rem' }}>Join the network to collaborate and create impact.</p>
      </div>

      {step === 1 ? (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 1 of 2 — Identity Verification</span>
          </div>
          <DigilockerMock entityType="ngo" onVerify={handleDigilockerSuccess} />
        </div>
      ) : (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 2 of 2 — Organization Details</span>
          </div>
          <form onSubmit={handleFinalSubmit}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input type="text" className="form-input" placeholder="e.g. Global Green Initiative" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input type="email" className="form-input" placeholder="contact@yourorg.org" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Primary SDG Focus</label>
              <select className="form-input" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})}>
                <option value="SDG 16: Peace & Justice">SDG 16: Peace & Justice</option>
                <option value="SDG 17: Partnerships for the Goals">SDG 17: Partnerships for the Goals</option>
                <option value="Environment">Environment & Climate</option>
                <option value="Education">Education & Literacy</option>
                <option value="Healthcare">Healthcare & Well-being</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Complete Registration</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NgoOnboarding;
