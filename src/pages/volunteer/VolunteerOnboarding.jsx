import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigilockerMock from '../../components/DigilockerMock';
import { Users, Smartphone, CheckCircle, KeyRound } from 'lucide-react';

const VolunteerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', interests: 'Environment' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) setStep(1.5);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') setStep(2);
    else alert('Invalid OTP. Use 1234 for demo.');
  };

  const handleDigilockerSuccess = () => setStep(3);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'volunteer', name: formData.name, id: 'vol_' + Math.random().toString(36).substr(2, 9), interests: formData.interests });
    navigate('/volunteer/dashboard');
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 0' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'rgba(30, 132, 73, 0.08)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
        }}>
          <Users size={28} style={{ color: 'var(--color-secondary)' }} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>Volunteer Registration</h1>
        <p style={{ fontSize: '0.95rem' }}>Join forces with verified NGOs and make an impact.</p>
      </div>

      {/* Step 1: Phone */}
      {step === 1 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: 420, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'rgba(26, 82, 118, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Smartphone size={18} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Phone Verification</h3>
          </div>
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        </div>
      )}

      {/* Step 1.5: OTP Entry */}
      {step === 1.5 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: 420, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'rgba(30, 132, 73, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <KeyRound size={18} style={{ color: 'var(--color-secondary)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Enter OTP</h3>
          </div>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            OTP sent to <strong style={{ color: 'var(--color-text-primary)' }}>{phone}</strong>. <em>Hint: 1234</em>
          </p>
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 700 }}
                maxLength={4}
                placeholder="• • • •"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Verify Phone</button>
          </form>
        </div>
      )}

      {/* Step 2: Aadhaar */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 2 — Aadhaar Identity Verification</span>
          </div>
          <DigilockerMock entityType="volunteer" onVerify={handleDigilockerSuccess} />
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="step-indicator">Step 3 — Personalize Your Journey</span>
          </div>
          <form onSubmit={handleFinalSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Interest</label>
              <select className="form-input" value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})}>
                <option value="Environment">Environment & Conservation</option>
                <option value="Education">Teaching & Education</option>
                <option value="Health">Healthcare Assistance</option>
                <option value="Disaster Relief">Disaster Relief</option>
              </select>
            </div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>Start Volunteering</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VolunteerOnboarding;
