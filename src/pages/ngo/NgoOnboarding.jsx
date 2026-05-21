import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigilockerMock from '../../components/DigilockerMock';
import { Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

const NgoOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', domain: 'SDG 16: Peace & Justice' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleDigilockerSuccess = () => setStep(2);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'ngo', name: formData.name, id: 'ngo_' + Math.random().toString(36).substr(2, 9), domain: formData.domain });
    navigate('/ngo/dashboard');
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
            <Building2 size={28} style={{ color: '#4A6741' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1E293B', fontWeight: 800 }}>{t('ngo_registration', language)}</h1>
          <p style={{ fontSize: '0.95rem', color: '#475569' }}>{t('ngo_reg_desc', language)}</p>
        </div>

        {step === 1 ? (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_1_of_2', language)}</span>
            </div>
            <DigilockerMock entityType="ngo" onVerify={handleDigilockerSuccess} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_2_of_2', language)}</span>
            </div>
            <form onSubmit={handleFinalSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('org_name', language)}</label>
                <input type="text" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_org_name', language)} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('contact_email', language)}</label>
                <input type="email" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_email', language)} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('primary_sdg', language)}</label>
                <select className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})}>
                  <option style={{ color: '#0F172A' }} value="SDG 16: Peace & Justice">{t('sdg_16', language)}</option>
                  <option style={{ color: '#0F172A' }} value="SDG 17: Partnerships for the Goals">{t('sdg_17', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Environment">{t('interest_env', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Education">{t('interest_edu', language)}</option>
                  <option style={{ color: '#0F172A' }} value="Healthcare">{t('interest_health', language)}</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#4A6741', color: '#FFFFFF', fontSize: '1rem', padding: '0.85rem' }}>{t('complete_reg', language)}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoOnboarding;
