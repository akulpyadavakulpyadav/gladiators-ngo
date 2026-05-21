import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { Users, Smartphone, KeyRound, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import DigilockerMock from '../components/DigilockerMock';

const LoginPage = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected role tab: defaults to URL query parameter or 'volunteer'
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'volunteer');
  const [loginStep, setLoginStep] = useState(1); // 1 = Entry, 1.5 = OTP verification (for volunteer), 2 = DigiLocker
  
  // Input fields state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  useEffect(() => {
    // Scroll to top when page is opened
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Update selected role state if query param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['volunteer', 'ngo', 'company'].includes(roleParam)) {
      setSelectedRole(roleParam);
      setLoginStep(1);
    }
  }, [searchParams]);

  // Form validations & handlers
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Keep only digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setLoginStep(1.5);
    } else {
      alert(t('alert_phone', language));
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') {
      login({
        role: 'volunteer',
        name: phone === '9876543210' ? 'Aniruddha' : 'Demo Volunteer',
        id: 'vol_' + Math.random().toString(36).substr(2, 9),
        interests: 'Environment'
      });
      navigate('/volunteer/dashboard');
    } else {
      alert(t('alert_otp', language));
    }
  };

  const handleNgoSubmit = (e) => {
    e.preventDefault();
    if (!orgId) {
      alert(t('alert_aadhaar', language)); // or general ID alert
      return;
    }
    // Mock successful NGO login
    login({
      role: 'ngo',
      name: orgEmail ? orgEmail.split('@')[0] : 'Global Green Initiative',
      id: 'ngo_' + Math.random().toString(36).substr(2, 9),
      orgId: orgId
    });
    navigate('/ngo/dashboard');
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyId) {
      alert(t('alert_aadhaar', language));
      return;
    }
    // Mock successful Corporate login
    login({
      role: 'company',
      name: companyEmail ? companyEmail.split('@')[0].toUpperCase() : 'Tata CSR',
      id: 'corp_' + Math.random().toString(36).substr(2, 9),
      companyId: companyId
    });
    navigate('/company/dashboard');
  };

  const handleDigilockerSuccess = () => {
    if (selectedRole === 'volunteer') {
      login({
        role: 'volunteer',
        name: 'Verified Citizen',
        id: 'vol_dl_' + Math.random().toString(36).substr(2, 9),
        interests: 'Education'
      });
      navigate('/volunteer/dashboard');
    } else if (selectedRole === 'ngo') {
      login({
        role: 'ngo',
        name: 'Verified Org',
        id: 'ngo_dl_' + Math.random().toString(36).substr(2, 9)
      });
      navigate('/ngo/dashboard');
    } else {
      login({
        role: 'company',
        name: 'Verified Corporate',
        id: 'corp_dl_' + Math.random().toString(36).substr(2, 9)
      });
      navigate('/company/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '3rem 1rem', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background decor */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(107, 143, 94, 0.15) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 520, padding: '3rem 2rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
        {/* Floating circular glowing logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%', overflow: 'hidden',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 0 20px rgba(107,143,94,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            marginBottom: '1rem'
          }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.4rem', fontWeight: 800 }}>{t('login_title', language)}</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>{t('login_sub', language)}</p>
        </div>

        {/* Role Selector Tabs (Only show if not in custom verification step) */}
        {loginStep === 1 && (
          <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(0, 0, 0, 0.15)', padding: '0.25rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
            {['volunteer', 'ngo', 'company'].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`tab-btn ${selectedRole === r ? 'tab-btn-active' : 'tab-btn-inactive'}`}
                style={{ flex: 1, padding: '0.5rem 0', fontSize: '0.8rem', textTransform: 'capitalize' }}
              >
                {t('role_' + r + '_title', language)}
              </button>
            ))}
          </div>
        )}

        {/* --- Step 1: Entry Views --- */}
        {loginStep === 1 && (
          <div className="animate-fade-in">
            {/* VOLUNTEER LOGIN */}
            {selectedRole === 'volunteer' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">{t('phone_number', language)}</label>
                  <div style={{ position: 'relative' }}>
                    <Smartphone size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      type="tel"
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder={t('placeholder_phone', language)}
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                  {t('send_otp', language)}
                </button>
              </form>
            )}

            {/* NGO LOGIN */}
            {selectedRole === 'ngo' && (
              <form onSubmit={handleNgoSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">{t('gov_reg_id', language)}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('placeholder_reg_id', language)}
                    value={orgId}
                    onChange={e => setOrgId(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact_email', language)}</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={t('placeholder_email', language)}
                    value={orgEmail}
                    onChange={e => setOrgEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                  {t('btn_login', language)}
                </button>
              </form>
            )}

            {/* COMPANY LOGIN */}
            {selectedRole === 'company' && (
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">{t('cin_reg_id', language)}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('placeholder_cin_id', language)}
                    value={companyId}
                    onChange={e => setCompanyId(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('csr_contact', language)}</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={t('placeholder_csr_email', language)}
                    value={companyEmail}
                    onChange={e => setCompanyEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                  {t('btn_login', language)}
                </button>
              </form>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '2rem 0 1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* DigiLocker Option */}
            <button
              onClick={() => setLoginStep(2)}
              className="btn btn-outline"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem' }}
            >
              <span>🔒</span> {t('login_via_digilocker', language)}
            </button>
          </div>
        )}

        {/* --- Step 1.5: OTP Entry (Volunteer Only) --- */}
        {loginStep === 1.5 && (
          <div className="animate-fade-in" style={{ maxWidth: 420, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <KeyRound size={18} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{t('enter_otp', language)}</h3>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
              {t('otp_sent_to', language)} <strong style={{ color: 'var(--color-text-primary)' }}>{phone}</strong>. <em>{t('otp_hint', language)}</em>
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 700 }}
                  maxLength={4}
                  placeholder={t('placeholder_otp', language)}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }}>
                {t('verify_phone_btn', language)}
              </button>
              <button
                type="button"
                onClick={() => setLoginStep(1)}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.75rem', border: 'none', background: 'transparent' }}
              >
                ← Back
              </button>
            </form>
          </div>
        )}

        {/* --- Step 2: DigiLocker Integration card --- */}
        {loginStep === 2 && (
          <div className="animate-fade-in">
            <button
              onClick={() => setLoginStep(1)}
              style={{
                background: 'transparent', border: 'none', color: 'var(--color-text-secondary)',
                fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              ← Back to standard login
            </button>
            <DigilockerMock entityType={selectedRole} onVerify={handleDigilockerSuccess} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
