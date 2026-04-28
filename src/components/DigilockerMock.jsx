import React, { useState } from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';

const LABELS = {
  ngo: 'Government Registration ID',
  company: 'CIN / Company Registration ID',
  volunteer: 'Aadhaar Number'
};

const DigilockerMock = ({ onVerify, entityType }) => {
  const [step, setStep] = useState(1);
  const [idValue, setIdValue] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (!idValue) return;
    setStep(2);
    setTimeout(() => {
      setStep(3);
      setTimeout(() => onVerify({ verifiedId: idValue }), 1500);
    }, 2000);
  };

  return (
    <div className="glass-card" style={{ 
      maxWidth: 420, margin: '0 auto', padding: '2rem', 
      borderTop: '3px solid var(--color-secondary)', position: 'relative', overflow: 'hidden' 
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.06 }}>
        <Shield size={160} style={{ color: 'var(--color-secondary)' }} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: '50%', 
          background: 'rgba(30, 132, 73, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Shield size={20} style={{ color: 'var(--color-secondary)' }} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>DigiLocker Verification</h3>
      </div>

      {step === 1 && (
        <form onSubmit={handleVerify} className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div className="form-group">
            <label className="form-label">{LABELS[entityType] || 'ID Number'}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your ID for verification"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
            <Shield size={16} /> Verify with DigiLocker
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Connecting to Government Databases...</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>Please wait</p>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <CheckCircle size={44} style={{ color: 'var(--color-secondary)', marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>Verification Successful!</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>Redirecting to next step...</p>
        </div>
      )}
    </div>
  );
};

export default DigilockerMock;
