import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';
import { 
  Briefcase, CheckCircle, Loader2, Shield, Lock, Plus, X, 
  MapPin, Mail, Phone, Globe, User, ArrowRight, ArrowLeft 
} from 'lucide-react';

const CompanyOnboarding = () => {
  const { language } = useLanguage();
  const { login, registerUser } = useAuth();
  const navigate = useNavigate();

  // Steps: 
  // 0 - Choice (Login vs Register)
  // 1 - Company Profile (Name, Email, Website, Headquarters, Sector, CIN)
  // 2 - Preferred CSR Focus Areas Tag Box
  // 3 - Point of Contact (Full Name, Phone, Designation, Email, OTP)
  // 4 - Set 6-Digit PIN
  // 5 - DigiLocker Verification (POC Aadhaar 12-digit)
  const [step, setStep] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    hqAddress: '',
    sector: 'Technology',
    cin: '',
    csrFocusAreas: [],
    pocName: '',
    pocPhone: '',
    pocDesignation: '',
    pocEmail: '',
    otp: '',
    pin: '',
    confirmPin: '',
    pocAadhaar: ''
  });

  const [alertBanner, setAlertBanner] = useState({ text: '', type: 'info' });

  const showAlert = (text, type = 'error') => {
    setAlertBanner({ text, type });
  };

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [csrInput, setCsrInput] = useState('');
  
  // Verification / Buffering loading states
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferStatus, setBufferStatus] = useState(''); // 'verifying', 'verified_success', 'registering'
  const [generatedUser, setGeneratedUser] = useState(null);

  // Quick CSR Focus Areas
  const quickCsrFocus = ['Education Enhancement', 'Environmental Sustainability', 'Healthcare Outreach', 'Clean Water & Sanitation', 'Gender Equality', 'Rural Development'];

  // Handle OTP Simulation
  const handleSendOtp = () => {
    if (!formData.pocEmail || !formData.pocEmail.includes('@')) {
      showAlert('Please enter a valid POC email address', 'error');
      return;
    }
    setOtpSent(true);
    showAlert('OTP simulation: Use "123456" to verify the Company point of contact email address.', 'info');
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '123456') {
      setOtpVerified(true);
      showAlert('POC email verified successfully!', 'success');
    } else {
      showAlert('Invalid OTP. Please enter 123456', 'error');
    }
  };

  // Add CSR Focus Area
  const handleAddCsr = (csrArea) => {
    const trimmed = csrArea.trim();
    if (trimmed && !formData.csrFocusAreas.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        csrFocusAreas: [...prev.csrFocusAreas, trimmed]
      }));
    }
    setCsrInput('');
  };

  // Remove CSR Focus Area
  const handleRemoveCsr = (csrArea) => {
    setFormData(prev => ({
      ...prev,
      csrFocusAreas: prev.csrFocusAreas.filter(item => item !== csrArea)
    }));
  };

  // Handle step transitions with validation
  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Company Name is compulsory';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Company Official Email is compulsory';
    if (!formData.hqAddress.trim()) return 'Headquarters Address is compulsory';
    if (!formData.website.trim() || !formData.website.startsWith('http')) return 'Please enter a valid website URL starting with http:// or https://';
    if (formData.cin.trim().length !== 21) return 'Company CIN Number must be exactly 21 digits/characters compulsorily';
    return null;
  };

  const validateStep2 = () => {
    if (formData.csrFocusAreas.length === 0) return 'Please select at least one CSR focus area';
    return null;
  };

  const validateStep3 = () => {
    if (!formData.pocName.trim()) return 'POC Full Name is compulsory';
    if (!formData.pocPhone.match(/^\d{10}$/)) return 'Enter a valid 10-digit POC phone number';
    if (!formData.pocDesignation.trim()) return 'POC Designation is compulsory';
    if (!formData.pocEmail.trim()) return 'POC Professional Email is compulsory';
    if (!otpVerified) return 'Please verify the POC email with the OTP first';
    return null;
  };

  const validateStep4 = () => {
    if (formData.pin.length !== 6 || isNaN(formData.pin)) return 'PIN must be exactly 6 digits';
    if (formData.pin !== formData.confirmPin) return 'PIN and Confirm PIN do not match';
    return null;
  };

  const handleNextStep = () => {
    setAlertBanner({ text: '', type: 'info' });
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        showAlert(err, 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        showAlert(err, 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) {
        showAlert(err, 'error');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      const err = validateStep4();
      if (err) {
        showAlert(err, 'error');
        return;
      }
      setStep(5);
    }
  };

  // DigiLocker Verification & Random GC-ID Generation
  const handleVerifyAadhaar = (e) => {
    e.preventDefault();
    const digitsOnly = formData.pocAadhaar.replace(/\D/g, '');
    if (digitsOnly.length !== 12) {
      showAlert('POC Aadhaar number must be exactly 12 digits', 'error');
      return;
    }
    if (formData.cin.trim().length !== 21) {
      showAlert('Company CIN must be exactly 21 digits/characters compulsorily to register', 'error');
      return;
    }

    // Start Buffer/Loading Animation
    setIsBuffering(true);
    setBufferStatus('verifying');

    setTimeout(() => {
      // Step 2 of buffer: Verified successfully
      setBufferStatus('verified_success');
      
      setTimeout(() => {
        // Step 3 of buffer: Registering
        setBufferStatus('registering');
        
        setTimeout(async () => {
          const newUser = {
            role: 'company',
            pin: formData.pin,
            name: formData.name,
            email: formData.email,
            website: formData.website,
            headquarters: formData.hqAddress,
            industrySector: formData.sector,
            cin: formData.cin,
            csrFocus: formData.csrFocusAreas,
            pocName: formData.pocName,
            pocPhone: formData.pocPhone,
            pocDesignation: formData.pocDesignation,
            pocEmail: formData.pocEmail,
            pocAadhaar: digitsOnly,
            budget: '5000000' // Default budget compatibility
          };

          // Save to Backend
          const result = await registerUser(newUser);
          if (result.success) {
            setGeneratedUser(result.user);
          } else {
            showAlert(result.message || 'Registration failed', 'error');
          }
          setIsBuffering(false);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleEnterDashboard = () => {
    login(generatedUser);
    navigate('/company/dashboard');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: 580, 
        padding: '3rem 2.5rem', 
        borderRadius: '1.5rem', 
        background: '#FFFFFF', 
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
      }}>
        
        {/* Buffering/Loading State */}
        {isBuffering && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '3rem 0', textAlign: 'center', animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem', color: '#2E7D32', border: '3px solid #81C784',
              boxShadow: '0 4px 10px rgba(46, 125, 50, 0.15)'
            }}>
              <Briefcase size={40} className="pulse-animation" style={{ color: '#2E7D32' }} />
            </div>

            {bufferStatus === 'verifying' && (
              <>
                <Loader2 size={36} className="animate-spin" style={{ color: '#F39C12', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#334155' }}>{t('connecting_to_digilo', language)}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>Verifying POC Aadhaar and {formData.cin.length} character corporate CIN.</p>
              </>
            )}

            {bufferStatus === 'verified_success' && (
              <>
                <CheckCircle size={44} style={{ color: '#2E7D32', marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#2E7D32', margin: 0 }}>{t('verified_successfull', language)}</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>{t('corporate_cin_aadhaa', language)}</p>
              </>
            )}

            {bufferStatus === 'registering' && (
              <>
                <Loader2 size={36} className="animate-spin" style={{ color: '#2E7D32', marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#2E7D32', margin: 0 }}>{t('registering', language)}</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>{t('creating_secure_gc_c', language)}</p>
              </>
            )}
          </div>
        )}

        {/* Registration Successful Credentials Screen */}
        {!isBuffering && generatedUser && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: '#E8F5E9',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem', color: '#2E7D32', border: '2px solid #81C784'
            }}>
              <CheckCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>{t('company_onboarded', language)}</h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '2rem' }}>
              Your company has been verified and registered successfully. Please record your login credentials.
            </p>

            <div style={{ 
              background: '#F8FAFC', border: '1px dashed #CBD5E1', 
              borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' 
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{t('gc_company_id', language)}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3D5A34', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                  {generatedUser.gcId}
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '0.25rem 0' }} />
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{t('secure_6_digit_pin', language)}</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>
                  {generatedUser.pin}
                </div>
              </div>
            </div>

            <button 
              onClick={handleEnterDashboard}
              className="btn"
              style={{
                width: '100%', padding: '0.85rem', background: '#3D5A34', color: '#FFFFFF',
                borderRadius: '0.75rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', border: 'none'
              }}
            >
              Enter Corporate Portal
            </button>
          </div>
        )}

        {/* Standard Step-by-Step UI Forms */}
        {!isBuffering && !generatedUser && (
          <div>
            {/* Header */}
            <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', background: '#F1F5F9',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
              }}>
                <Briefcase size={26} style={{ color: '#4A6741' }} />
              </div>
              <h1 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: '#1E293B', fontWeight: 800 }}>
                {step === 0 ? 'Corporate Portal' : 'Corporate Onboarding'}
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                {step === 0 ? 'Register your enterprise or log in to coordinate CSR activities.' : `Step ${step} of 5: Enter details`}
              </p>
            </div>

            {alertBanner.text && (
              <div style={{
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
                borderRadius: '0.75rem',
                background: alertBanner.type === 'success' ? '#E8F5E9' : alertBanner.type === 'info' ? '#E0F2F1' : '#FEF2F2',
                border: `1.5px solid ${alertBanner.type === 'success' ? '#81C784' : alertBanner.type === 'info' ? '#4DB6AC' : '#FCA5A5'}`,
                color: alertBanner.type === 'success' ? '#2E7D32' : alertBanner.type === 'info' ? '#00695C' : '#EF4444',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {alertBanner.type === 'success' ? <CheckCircle size={16} /> : <Shield size={16} />}
                  <span>{alertBanner.text}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAlertBanner({ text: '', type: 'info' })}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: 0 }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Step 0: Gatekeeper */}
            {step === 0 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <button
                  onClick={() => navigate('/login?role=company')}
                  style={{
                    width: '100%', background: 'rgba(241, 245, 249, 0.65)', border: '2px solid #E2E8F0',
                    borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#4A6741'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Lock size={18} style={{ color: '#4A6741' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.15rem 0' }}>{t('login', language)}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{t('access_your_corporat', language)}</p>
                  </div>
                </button>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    width: '100%', background: 'rgba(241, 245, 249, 0.65)', border: '2px solid #E2E8F0',
                    borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#4A6741'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Plus size={18} style={{ color: '#4A6741' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.15rem 0' }}>{t('register_enterprise', language)}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{t('validate_via_corpora', language)}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Step 1: Corporate Profile */}
            {step === 1 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('name_of_the_company', language)}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('enter_registered_cor', language)}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('industry_sector', language)}</label>
                    <select
                      value={formData.sector}
                      onChange={e => setFormData({ ...formData, sector: e.target.value })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', background: '#FFFFFF' }}
                    >
                      <option value="Technology">{t('technology', language)}</option>
                      <option value="Finance & Banking">{t('finance_banking', language)}</option>
                      <option value="Manufacturing">{t('manufacturing', language)}</option>
                      <option value="Healthcare">{t('healthcare', language)}</option>
                      <option value="Energy & Utilities">{t('energy_utilities', language)}</option>
                      <option value="Consumer Goods">{t('consumer_goods', language)}</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('official_website_url', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('https_www_company_co', language)}
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('official_corporate_e', language)}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('placeholder_csr_email', language)}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('headquarters_address', language)}</label>
                  <textarea
                    required
                    rows={2}
                    placeholder={t('corporate_hq_address', language)}
                    value={formData.hqAddress}
                    onChange={e => setFormData({ ...formData, hqAddress: e.target.value })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('cin_number_exactly_2', language)}</label>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: formData.cin.length === 21 ? '#2E7D32' : '#E67E22' }}>
                      {formData.cin.length} / 21
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={21}
                    placeholder={t('e_g_l01234ka2026plc0', language)}
                    value={formData.cin}
                    onChange={e => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                  />
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{ flex: 1, padding: '0.75rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Preferred CSR Focus Areas */}
            {step === 2 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{t('selected_csr_focus_a', language)}</label>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
                    border: '2px solid #CBD5E1', padding: '0.75rem',
                    borderRadius: '0.5rem', minHeight: '60px', background: '#F8FAFC',
                    alignItems: 'center'
                  }}>
                    {formData.csrFocusAreas.length > 0 ? (
                      formData.csrFocusAreas.map((csr, idx) => (
                        <span key={idx} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          background: '#E2E8F0', color: '#334155', padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 600
                        }}>
                          {csr}
                          <button
                            type="button"
                            onClick={() => handleRemoveCsr(csr)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>{t('please_select_target', language)}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder={t('type_custom_sector', language)}
                    value={csrInput}
                    onChange={e => setCsrInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (csrInput.trim()) handleAddCsr(csrInput);
                      }
                    }}
                    style={{ flex: 1, padding: '0.6rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (csrInput.trim()) handleAddCsr(csrInput);
                    }}
                    style={{ padding: '0.6rem 1.25rem', background: '#4A6741', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>{t('predefined_csr_secto', language)}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {quickCsrFocus.map((csr, i) => {
                      const selected = formData.csrFocusAreas.includes(csr);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selected ? handleRemoveCsr(csr) : handleAddCsr(csr)}
                          style={{
                            padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600,
                            borderRadius: '2rem', border: '1px solid',
                            borderColor: selected ? '#3D5A34' : '#CBD5E1',
                            background: selected ? '#E8F5E9' : '#FFFFFF',
                            color: selected ? '#2E7D32' : '#475569',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {csr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{ flex: 1, padding: '0.75rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Primary Contact Person Details & OTP */}
            {step === 3 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', margin: 0 }}>{t('primary_point_of_con', language)}</h3>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('full_name_1', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('poc_full_name', language)}
                      value={formData.pocName}
                      onChange={e => setFormData({ ...formData, pocName: e.target.value })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('designation', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('e_g_csr_head_vp_hr', language)}
                      value={formData.pocDesignation}
                      onChange={e => setFormData({ ...formData, pocDesignation: e.target.value })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('phone_number_1', language)}</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder={t('10_digit_poc_phone_n', language)}
                    value={formData.pocPhone}
                    onChange={e => setFormData({ ...formData, pocPhone: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                </div>

                {/* POC Email Verification Block */}
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('poc_professional_ema', language)}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="email"
                        required
                        disabled={otpVerified}
                        placeholder={t('poc_name_company_com', language)}
                        value={formData.pocEmail}
                        onChange={e => setFormData({ ...formData, pocEmail: e.target.value })}
                        style={{ flex: 1, padding: '0.6rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', background: otpVerified ? '#E2E8F0' : '#FFFFFF' }}
                      />
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          style={{ padding: '0.6rem 1rem', background: '#4A6741', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          {otpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && !otpVerified && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', animation: 'fadeIn 0.2s ease-out' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{t('enter_6_digit_otp', language)}</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                           type="text"
                           maxLength={6}
                           placeholder={t('e_g_123456', language)}
                           value={formData.otp}
                           onChange={e => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                           style={{ flex: 1, padding: '0.5rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', textAlign: 'center', letterSpacing: '0.2em', fontWeight: 700 }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          style={{ padding: '0.5rem 1rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#2E7D32', fontWeight: 700,
                      background: '#E8F5E9', border: '1px solid #C8E6C9', padding: '0.4rem 0.75rem', borderRadius: '0.5rem'
                    }}>
                      <CheckCircle size={16} /> POC email verified successfully.
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{ flex: 1, padding: '0.75rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Set PIN */}
            {step === 4 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  background: '#F1F5F9', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#475569',
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem', borderLeft: '4px solid #4A6741'
                }}>
                  <Shield size={18} style={{ color: '#4A6741', flexShrink: 0 }} />
                  <div>
                    <strong>{t('secure_login_setup', language)}</strong> Set a 6-digit PIN which will be required along with your GC-Company ID to access your portal in future sessions.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('enter_6_digit_pin', language)}</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={formData.pin}
                    onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '1.1rem', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('confirm_6_digit_pin', language)}</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={formData.confirmPin}
                    onChange={e => setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '1.1rem', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}
                  />
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{ flex: 1, padding: '0.75rem', background: '#3D5A34', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: DigiLocker Verification */}
            {step === 5 && (
              <form onSubmit={handleVerifyAadhaar} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  padding: '1.5rem', border: '1px solid #E2E8F0', background: '#F8FAFC',
                  borderRadius: '1rem', borderTop: '4px solid #F39C12', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.05 }}>
                    <Shield size={120} style={{ color: '#F39C12' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Shield size={20} style={{ color: '#F39C12' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{t('digilocker_verified_', language)}</h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                    To finalize corporate registration, verify the identity of primary contact person <strong>{formData.pocName}</strong> {t('via_digilocker_datab', language)} <strong>{t('12_digit_aadhaar_num', language)}</strong>.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('primary_contact_aadh', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000"
                      maxLength={14}
                      value={formData.pocAadhaar}
                      onChange={e => {
                        const cleanVal = e.target.value.replace(/\D/g, '');
                        if (cleanVal.length <= 12) {
                          const parts = [];
                          for (let i = 0; i < cleanVal.length; i += 4) {
                            parts.push(cleanVal.substring(i, i + 4));
                          }
                          setFormData({ ...formData, pocAadhaar: parts.join(' ') });
                        }
                      }}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '1rem', textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em' }}
                    />
                  </div>
                </div>

                {/* Verification Check List */}
                <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.8rem', color: '#2E7D32', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
                    <CheckCircle size={14} /> Corporate CIN status: {formData.cin} (21 chars valid)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
                    <CheckCircle size={14} /> OTP Verification status: Verified
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '0.75rem', background: '#F39C12', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', boxShadow: '0 4px 6px rgba(243, 156, 18, 0.15)' }}
                  >
                    <Shield size={16} /> Verify & Register
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyOnboarding;
