import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';
import { 
  Users, CheckCircle, Loader2, Shield, Heart, Lock, Plus, X, 
  MapPin, Mail, Phone, Calendar, ArrowRight, ArrowLeft 
} from 'lucide-react';

const VolunteerOnboarding = () => {
  const { language } = useLanguage();
  const { login, registerUser } = useAuth();
  const navigate = useNavigate();

  // Steps: 
  // 0 - Choice (Login vs Register)
  // 1 - Personal Info (Name, Phone, Email, OTP, Age, Full Address)
  // 2 - Primary Interests Tag Box
  // 3 - Set 6-Digit PIN
  // 4 - DigiLocker Verification (Aadhaar 12-digit)
  const [step, setStep] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    otp: '',
    age: '',
    fullAddress: '',
    interests: [],
    pin: '',
    confirmPin: '',
    aadhaar: ''
  });

  const [alertBanner, setAlertBanner] = useState({ text: '', type: 'info' });

  const showAlert = (text, type = 'error') => {
    setAlertBanner({ text, type });
  };

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  
  // Verification / Buffering loading states
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferStatus, setBufferStatus] = useState(''); // 'verifying', 'verified_success', 'registering'
  const [generatedUser, setGeneratedUser] = useState(null);

  // Interest options for quick selection
  const quickInterests = ['Environment', 'Education', 'Health', 'Disaster Relief', 'Animal Welfare', 'Rural Development'];

  // Handle OTP Simulation
  const handleSendOtp = () => {
    if (!formData.email || !formData.email.includes('@')) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }
    setOtpSent(true);
    showAlert('OTP simulation: Use "123456" to verify the volunteer email address.', 'info');
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '123456') {
      setOtpVerified(true);
      showAlert('Email verified successfully!', 'success');
    } else {
      showAlert('Invalid OTP. Please enter 123456', 'error');
    }
  };

  // Add Interest
  const handleAddInterest = (interest) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed]
      }));
    }
    setInterestInput('');
  };

  // Remove Interest
  const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(item => item !== interest)
    }));
  };

  // Handle step transitions with validation
  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Name is compulsory';
    if (!formData.phone.match(/^\d{10}$/)) return 'Enter a valid 10-digit phone number';
    if (!formData.email.trim()) return 'Email is compulsory';
    if (!otpVerified) return 'Please verify your email with the OTP first';
    if (!formData.age || parseInt(formData.age) <= 0) return 'Please enter a valid age';
    if (!formData.fullAddress.trim()) return 'Full Address is compulsory';
    return null;
  };

  const validateStep2 = () => {
    if (formData.interests.length === 0) return 'Please select at least one primary interest';
    return null;
  };

  const validateStep3 = () => {
    if (formData.pin.length !== 6 || isNaN(formData.pin)) return 'PIN must be exactly 6 digits';
    if (formData.pin !== formData.confirmPin) return 'PIN and Confirm PIN do not match';
    return null;
  };

  const handleNextStep = () => {
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
    }
  };

  // DigiLocker Verification & Random GC-ID Generation
  const handleVerifyAadhaar = (e) => {
    e.preventDefault();
    const digitsOnly = formData.aadhaar.replace(/\D/g, '');
    if (digitsOnly.length !== 12) {
      showAlert('Aadhaar number must be exactly 12 digits', 'error');
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
            role: 'volunteer',
            pin: formData.pin,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            age: formData.age,
            fullAddress: formData.fullAddress,
            location: formData.fullAddress,
            interests: formData.interests,
            aadhaar: digitsOnly
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
    navigate('/volunteer/dashboard');
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
              <Heart size={40} className="pulse-animation" fill="#2E7D32" />
            </div>

            {bufferStatus === 'verifying' && (
              <>
                <Loader2 size={36} className="animate-spin" style={{ color: '#F39C12', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#334155' }}>{t('connecting_to_digilo_2', language)}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>{t('please_verify_aadhaa', language)}</p>
              </>
            )}

            {bufferStatus === 'verified_success' && (
              <>
                <CheckCircle size={44} style={{ color: '#2E7D32', marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#2E7D32', margin: 0 }}>{t('verified_successfull_2', language)}</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>{t('aadhaar_matching_che', language)}</p>
              </>
            )}

            {bufferStatus === 'registering' && (
              <>
                <Loader2 size={36} className="animate-spin" style={{ color: '#2E7D32', marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#2E7D32', margin: 0 }}>{t('registering_2', language)}</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem' }}>{t('creating_secure_gc_v', language)}</p>
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
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>{t('welcome_to_gladiconn', language)}</h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '2rem' }}>
              Your profile has been created and verified. Please note down your credentials.
            </p>

            <div style={{ 
              background: '#F8FAFC', border: '1px dashed #CBD5E1', 
              borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' 
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{t('gc_volunteer_id', language)}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3D5A34', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                  {generatedUser.gcId}
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '0.25rem 0' }} />
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{t('secure_6_digit_pin_2', language)}</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>
                  {generatedUser.pin}
                </div>
              </div>
              <div style={{
                background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem'
              }}>
                <Shield size={14} /> Memory-Only Store: Credential deletes completely upon page refresh.
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
              Enter Dashboard
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
                <Users size={26} style={{ color: '#4A6741' }} />
              </div>
              <h1 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: '#1E293B', fontWeight: 800 }}>
                {step === 0 ? 'Volunteer Portal' : 'Volunteer Onboarding'}
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                {step === 0 ? 'Create a new profile or log in to track your impact.' : `Step ${step} of 4: Enter your details`}
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
                  onClick={() => navigate('/login?role=volunteer')}
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
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{t('access_your_voluntee', language)}</p>
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
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.15rem 0' }}>{t('register', language)}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{t('verify_credentials_c', language)}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Step 1: Personal Info & OTP */}
            {step === 1 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('name_as_per_records', language)}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('enter_your_official_', language)}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('age', language)}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder={t('e_g_21', language)}
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value.replace(/\D/g, '') })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('full_address', language)}</label>
                    <textarea
                      required
                      rows={1}
                      placeholder={t('street_city_state_pi', language)}
                      value={formData.fullAddress}
                      onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('phone_number_3', language)}</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder={t('10_digit_number_2', language)}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Email Verification Form Block */}
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('email_address_1', language)}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="email"
                        required
                        disabled={otpVerified}
                        placeholder={t('email_example_com', language)}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>{t('enter_6_digit_otp_2', language)}</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder={t('e_g_123456_2', language)}
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
                      <CheckCircle size={16} /> Email verified successfully.
                    </div>
                  )}
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

            {/* Step 2: Primary Interests Tag Box */}
            {step === 2 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{t('selected_primary_int', language)}</label>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
                    border: '2px solid #CBD5E1', padding: '0.75rem',
                    borderRadius: '0.5rem', minHeight: '60px', background: '#F8FAFC',
                    alignItems: 'center'
                  }}>
                    {formData.interests.length > 0 ? (
                      formData.interests.map((interest, idx) => (
                        <span key={idx} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          background: '#E2E8F0', color: '#334155', padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 600
                        }}>
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>{t('please_select_primar', language)}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder={t('type_custom_interest', language)}
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (interestInput.trim()) handleAddInterest(interestInput);
                      }
                    }}
                    style={{ flex: 1, padding: '0.6rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (interestInput.trim()) handleAddInterest(interestInput);
                    }}
                    style={{ padding: '0.6rem 1.25rem', background: '#4A6741', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>{t('quick_selection', language)}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {quickInterests.map((interest, i) => {
                      const selected = formData.interests.includes(interest);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selected ? handleRemoveInterest(interest) : handleAddInterest(interest)}
                          style={{
                            padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600,
                            borderRadius: '2rem', border: '1px solid',
                            borderColor: selected ? '#3D5A34' : '#CBD5E1',
                            background: selected ? '#E8F5E9' : '#FFFFFF',
                            color: selected ? '#2E7D32' : '#475569',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {interest}
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

            {/* Step 3: Set PIN */}
            {step === 3 && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  background: '#F1F5F9', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#475569',
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem', borderLeft: '4px solid #4A6741'
                }}>
                  <Shield size={18} style={{ color: '#4A6741', flexShrink: 0 }} />
                  <div>
                    <strong>{t('secure_login_setup_2', language)}</strong> Set a 6-digit PIN which will be required along with your GC-ID to access your portal in future sessions.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('enter_6_digit_pin_2', language)}</label>
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
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('confirm_6_digit_pin_2', language)}</label>
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

            {/* Step 4: DigiLocker Aadhaar Verification */}
            {step === 4 && (
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
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{t('digilocker_verified__2', language)}</h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                    To complete your registration, authenticate via the official Indian DigiLocker database. Enter your <strong>{t('12_digit_aadhaar_car', language)}</strong> to verify your identity.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{t('volunteer_aadhaar_nu', language)}</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000"
                      maxLength={14}
                      value={formData.aadhaar}
                      onChange={e => {
                        const cleanVal = e.target.value.replace(/\D/g, '');
                        if (cleanVal.length <= 12) {
                          const parts = [];
                          for (let i = 0; i < cleanVal.length; i += 4) {
                            parts.push(cleanVal.substring(i, i + 4));
                          }
                          setFormData({ ...formData, aadhaar: parts.join(' ') });
                        }
                      }}
                      style={{ padding: '0.65rem 0.75rem', border: '2px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '1rem', textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em' }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
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

export default VolunteerOnboarding;
