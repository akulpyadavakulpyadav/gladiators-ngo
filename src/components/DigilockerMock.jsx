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
  const handleIdChange = (e) => {
    const rawVal = e.target.value;
    if (entityType === 'volunteer') {
      const cleanVal = rawVal.replace(/\D/g, ''); // Keep only digits
      if (cleanVal.length <= 12) {
        // Format with space every 4 digits
        const parts = [];
        for (let i = 0; i < cleanVal.length; i += 4) {
          parts.push(cleanVal.substring(i, i + 4));
        }
        setIdValue(parts.join(' '));
      }
    } else {
      setIdValue(rawVal);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!idValue) return;

    if (entityType === 'volunteer') {
      const digitsOnly = idValue.replace(/\D/g, '');
      if (digitsOnly.length !== 12) {
        alert('Please enter a valid 12-digit Aadhaar number.');
        return;
      }
    }

    setStep(2);
    setTimeout(() => {
      setStep(3);
      setTimeout(() => onVerify({ verifiedId: idValue }), 1500);
    }, 2000);
  };

  return (
    <div style={{ 
      maxWidth: 420, margin: '0 auto', padding: '2rem', 
      borderTop: '3px solid #F39C12', position: 'relative', overflow: 'hidden',
      background: '#F8FAFC', borderRadius: '1rem', border: '1px solid #E2E8F0'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.06 }}>
        <Shield size={160} style={{ color: '#F39C12' }} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: '50%', 
          background: 'rgba(243, 156, 18, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Shield size={20} style={{ color: '#F39C12' }} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>DigiLocker Verification</h3>
      </div>

      {step === 1 && (
        <form onSubmit={handleVerify} className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{LABELS[entityType] || 'ID Number'}</label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }}
              placeholder={entityType === 'volunteer' ? "XXXX XXXX XXXX" : "Enter your ID for verification"}
              value={idValue}
              onChange={handleIdChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', background: '#F39C12', color: '#FFFFFF', fontWeight: 700 }}>
            <Shield size={16} /> Verify with DigiLocker
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: '#F39C12', marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>Connecting to Government Databases...</p>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>Please wait</p>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <CheckCircle size={44} style={{ color: '#27AE60', marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#27AE60' }}>Verification Successful!</p>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>Redirecting to next step...</p>
        </div>
      )}
    </div>
  );
};

export default DigilockerMock;
