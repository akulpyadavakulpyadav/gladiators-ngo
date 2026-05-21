import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DigilockerMock from '../../components/DigilockerMock';
import { Briefcase, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

const CompanyOnboarding = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', budget: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleDigilockerSuccess = () => setStep(2);

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    login({ role: 'company', name: formData.name, id: 'comp_' + Math.random().toString(36).substr(2, 9), budget: formData.budget });
    navigate('/company/dashboard');
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
            <Briefcase size={28} style={{ color: '#4A6741' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1E293B', fontWeight: 800 }}>{t('corp_registration', language)}</h1>
          <p style={{ fontSize: '0.95rem', color: '#475569' }}>{t('corp_reg_desc', language)}</p>
        </div>

        {/* Step 0: Gatekeeper / Choice Page */}
        {step === 0 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 460, margin: '0 auto' }}>
            <button
              onClick={() => navigate('/login?role=company')}
              style={{
                width: '100%',
                background: 'rgba(241, 245, 249, 0.65)',
                border: '2px solid #E2E8F0',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4A6741';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 103, 69, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <LogIn size={20} style={{ color: '#4A6741' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.15rem 0' }}>
                  {t('login', language)}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.35 }}>
                  {language === 'KN' ? 'ಪ್ರಚಾರಗಳಿಗೆ ಧನಸಹಾಯ ಮಾಡಲು ಮತ್ತು ಅನುಸರಣೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಿಮ್ಮ ಕಾರ್ಪೊರೇಟ್ ಪೋರ್ಟಲ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ.' : language === 'HI' ? 'अभियानों को निधि देने और अनुपालन को ट्रैक करने के लिए अपने कॉर्पोरेट पोर्टल में लॉग इन करें।' : 'Login to your corporate portal to fund campaigns and track compliance.'}
                </p>
              </div>
            </button>

            <button
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                background: 'rgba(241, 245, 249, 0.65)',
                border: '2px solid #E2E8F0',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4A6741';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 103, 69, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <UserPlus size={20} style={{ color: '#4A6741' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.15rem 0' }}>
                  {t('register', language)}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.35 }}>
                  {language === 'KN' ? 'ಸಿಎಸ್ಆರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಮತ್ತು ಆಡಿಟ್ ಮಾಡಲಾದ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ನಿಮ್ಮ ಕಂಪನಿಯನ್ನು ನೋಂದಾಯಿಸಿ.' : language === 'HI' ? 'सीएसआर डैशबोर्ड अनलॉक करने और ऑडिट की गई परियोजनाओं को खोजने के लिए अपनी कंपनी को शामिल करें।' : 'Onboard your company to unlock CSR dashboards and discover audited projects.'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Step 1: DigiLocker Verification */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_1_corp', language)}</span>
            </div>
            <DigilockerMock entityType="company" onVerify={handleDigilockerSuccess} />
          </div>
        )}

        {/* Step 2: Form Details */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="step-indicator" style={{ background: '#F1F5F9', color: '#4A6741', fontWeight: 700 }}>{t('step_2_csr', language)}</span>
            </div>
            <form onSubmit={handleFinalSubmit}>
...
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('company_name', language)}</label>
                <input type="text" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_company', language)} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('csr_contact', language)}</label>
                <input type="email" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_csr_email', language)} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>{t('annual_budget', language)}</label>
                <input type="number" className="form-input" style={{ background: '#FFFFFF', color: '#0F172A', borderColor: '#CBD5E1', borderWidth: '2px' }} placeholder={t('placeholder_budget', language)} value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#4A6741', color: '#FFFFFF', fontSize: '1rem', padding: '0.85rem' }}>{t('access_portal', language)}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyOnboarding;
