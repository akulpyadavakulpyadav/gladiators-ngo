import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';
import DigilockerMock from '../../components/DigilockerMock';
import { Users, Smartphone, CheckCircle, KeyRound } from 'lucide-react';

const VolunteerOnboarding = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', interests: 'Environment' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Keep only digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep(1.5);
    } else {
      alert(t('alert_phone', language));
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') setStep(2);
    else alert(t('alert_otp', language));
  };

  const handleDigilockerSuccess = () => setStep(3);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'volunteer', name: formData.name, id: 'vol_' + Math.random().toString(36).substr(2, 9), interests: formData.interests });
    navigate('/volunteer/dashboard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 560, padding: '3rem 2rem', borderRadius: '1.5rem', background: '#FFFFFF', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)' }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#F1F5F9',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
          }}>
            <Users size={28} style={{ color: '#4A6741' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1E293B', fontWeight: 800 }}>{t('vol_reg', language)}</h1>
          <p style={{ fontSize: '0.95rem', color: '#475569' }}>{t('vol_join_sub', language)}</p>
        </div>

        {/* Step 1: Phone */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ maxWidth: 420, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Smartphone size={18} style={{ color: '#4A6741' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1E293B' }}>{t('phone_verify', language)}</h3>
            </div>
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('phone_number', language)}</label>
                <input
                  type="tel"
                  className="form-input"
                  style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }}
                  placeholder={t('placeholder_phone', language)}
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#4A6741', color: '#FFFFFF', fontSize: '1rem', padding: '0.85rem' }}>{t('send_otp', language)}</button>
            </form>
          </div>
        )}

        {/* Step 1.5: OTP Entry */}
        {step === 1.5 && (
          <div className="animate-fade-in" style={{ maxWidth: 420, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <KeyRound size={18} style={{ color: '#4A6741' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1E293B' }}>{t('enter_otp', language)}</h3>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#475569' }}>
              {t('otp_sent_to', language)} <strong style={{ color: '#0F172A' }}>{phone}</strong>. <em>{t('otp_hint', language)}</em>
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 700, background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }}
                  maxLength={4}
                  placeholder={t('placeholder_otp', language)}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', background: '#4A6741', color: '#FFFFFF', fontSize: '1rem', padding: '0.85rem' }}>{t('verify_phone_btn', language)}</button>
            </form>
          </div>
        )}

        {/* Step 2: Aadhaar */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_2_aadhaar', language)}</span>
            </div>
            <DigilockerMock entityType="volunteer" onVerify={handleDigilockerSuccess} />
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_3_personalize', language)}</span>
            </div>
            <form onSubmit={handleFinalSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('full_name', language)}</label>
                <input type="text" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_fullname', language)} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('primary_interest', language)}</label>
                <select className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})}>
                  <option style={{ color: '#0F172A' }} value="Environment">{t('interest_env', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Education">{t('interest_edu', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Health">{t('interest_health', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Disaster Relief">{t('interest_relief', language)}</option>
                </select>
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', background: '#4A6741', color: '#FFFFFF', fontSize: '1rem', padding: '0.85rem' }}>{t('start_volunteering', language)}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerOnboarding;

