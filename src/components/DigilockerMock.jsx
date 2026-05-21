import React, { useState } from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

const LABELS = {
  ngo: 'Government Registration ID',
  company: 'CIN / Company Registration ID',
  volunteer: 'Aadhaar Number'
};

const DigilockerMock = ({ onVerify, entityType }) => {
  const { language } = useLanguage();
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
        alert(t('alert_aadhaar', language));
        return;
      }
    }

    setStep(2);
    setTimeout(() => {
      setStep('error');
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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>{t('digilocker_title', language)}</h3>
      </div>

      {step === 1 && (
        <form onSubmit={handleVerify} className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>
              {t(entityType === 'ngo' ? 'gov_reg_id' : (entityType === 'company' ? 'cin_reg_id' : 'aadhaar_num'), language)}
            </label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }}
              placeholder={entityType === 'volunteer' ? t('placeholder_aadhaar', language) : t('placeholder_id', language)}
              value={idValue}
              onChange={handleIdChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', background: '#F39C12', color: '#FFFFFF', fontWeight: 700 }}>
            <Shield size={16} /> {t('verify_button', language)}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <Loader2 size={40} className="animate-spin" style={{ color: '#F39C12', marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>{t('db_connecting', language)}</p>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>{t('please_wait', language)}</p>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2.5rem 0', position: 'relative', zIndex: 1 
        }}>
          <CheckCircle size={44} style={{ color: '#27AE60', marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#27AE60' }}>{t('verify_success', language)}</p>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>{t('redirecting', language)}</p>
        </div>
      )}

      {step === 'error' && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '2rem 0', position: 'relative', zIndex: 1, textAlign: 'center' 
        }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E74C3C', margin: '0 0 0.5rem 0' }}>{t('verification_failed', language)}</p>
          <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
            {t('digilocker_disabled_desc', language)}
          </p>
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', color: '#64748B', borderColor: '#CBD5E1' }}
            onClick={() => {
              setIdValue('');
              setStep(1);
            }}
          >
            {t('retry', language)}
          </button>
        </div>
      )}
    </div>
  );
};

export default DigilockerMock;
