import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IndianRupee, FileText, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../utils/translations';

/* ─── Funding Portal ─── */
const FundingPortal = () => {
  const { language } = useLanguage();

  const getStatLabelKey = (label) => {
    if (label === 'Total Budget Allocated') return 'total_budget';
    if (label === 'Funds Disbursed') return 'funds_disbursed';
    if (label === 'Active Partnerships') return 'active_partnerships';
    return label;
  };

  const getCampaignStatusTranslation = (status, lang) => {
    if (status === 'On Track') return lang === 'KN' ? 'ಸರಿಯಾದ ಹಾದಿಯಲ್ಲಿದೆ' : lang === 'HI' ? 'ट्रैक पर' : 'On Track';
    if (status === 'Pending Review') return lang === 'KN' ? 'ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ' : lang === 'HI' ? 'समीक्षा लंबित' : 'Pending Review';
    if (status === 'Completed') return lang === 'KN' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : lang === 'HI' ? 'पूरा हुआ' : 'Completed';
    return status;
  };

  const getNgoTranslation = (ngo, lang) => {
    if (ngo === 'Global Green Initiative') return lang === 'KN' ? 'ಗ್ಲೋಬಲ್ ಗ್ರೀನ್ ಇನಿಶಿಯೇಟಿವ್' : lang === 'HI' ? 'ग्लोबल ग्रीन इनिशिएटिव' : 'Global Green Initiative';
    if (ngo === 'EduCare Foundation') return lang === 'KN' ? 'ಎಡುಕೇರ್ ಫೌಂಡೇಶನ್' : lang === 'HI' ? 'एडुकेयर फाउंडेशन' : 'EduCare Foundation';
    if (ngo === 'OceanSavers Network') return lang === 'KN' ? 'ಓಷನ್ ಸೇವರ್ಸ್ ನೆಟ್‌ವರ್ಕ್' : lang === 'HI' ? 'ओशनसेवर्स नेटवर्क' : 'OceanSavers Network';
    return ngo;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-md-3">
        {[
          { label: 'Total Budget Allocated', value: '₹ 50.0L', color: 'var(--color-primary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Funds Disbursed', value: '₹ 32.5L', color: 'var(--color-secondary)', bg: 'rgba(0, 0, 0, 0.05)' },
          { label: 'Active Partnerships', value: language === 'KN' ? '4 ಎನ್‌ಜಿಒಗಳು' : language === 'HI' ? '4 एनजीओ' : '4 NGOs', color: 'var(--color-text-primary)', bg: 'rgba(0, 0, 0, 0.05)' }
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'left' }}>
            <div className="stat-label" style={{ marginBottom: '0.5rem' }}>{t(getStatLabelKey(s.label), language)}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: '1.75rem', textAlign: 'left' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 className="section-title">{t('active_campaigns_title', language)}</h3>
        <div className="space-y-4">
          {[
            { ngo: 'Global Green Initiative', amount: '₹ 12.0L', status: 'On Track', progress: 80, done: false },
            { ngo: 'EduCare Foundation', amount: '₹ 8.5L', status: 'Pending Review', progress: 40, done: false },
            { ngo: 'OceanSavers Network', amount: '₹ 12.0L', status: 'Completed', progress: 100, done: true }
          ].map((camp, i) => (
            <div key={i} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem', margin: 0 }}>{getNgoTranslation(camp.ngo, language)}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0' }}>
                    {camp.amount} {language === 'KN' ? 'ಹಂಚಿಕೆ ಮಾಡಲಾಗಿದೆ' : language === 'HI' ? 'आवंटित' : 'Allocated'}
                  </p>
                </div>
                <span className={`badge ${camp.done ? 'badge-secondary' : 'badge-primary'}`}>{getCampaignStatusTranslation(camp.status, language)}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ 
                  width: `${camp.progress}%`, 
                  background: camp.done 
                    ? 'var(--color-secondary)' 
                    : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))' 
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Due Diligence ─── */
const DueDiligence = () => {
  const { language } = useLanguage();

  const getNgoTranslation = (ngo, lang) => {
    if (ngo === 'Global Green Initiative') return lang === 'KN' ? 'ಗ್ಲೋಬಲ್ ಗ್ರೀನ್ ಇನಿಶಿಯೇಟಿವ್' : lang === 'HI' ? 'ग्लोबल ग्रीन इनिशिएटिव' : 'Global Green Initiative';
    if (ngo === 'EduCare Foundation') return lang === 'KN' ? 'ಎಡುಕೇರ್ ಫೌಂಡೇಶನ್' : lang === 'HI' ? 'एडुकेयर फाउंडेशन' : 'EduCare Foundation';
    if (ngo === 'HealthFirst NGO') return lang === 'KN' ? 'ಹೆಲ್ತ್‌ಫಸ್ಟ್ ಎನ್‌ಜಿಒ' : lang === 'HI' ? 'हेल्थफर्स्ट एनजीओ' : 'HealthFirst NGO';
    return ngo;
  };

  const getStatusTranslation = (status, lang) => {
    if (status === 'Verified') return lang === 'KN' ? 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : lang === 'HI' ? 'सत्यापित' : 'Verified';
    if (status === 'Pending') return lang === 'KN' ? 'ಬಾಕಿ ಇದೆ' : lang === 'HI' ? 'लंबित' : 'Pending';
    return status;
  };

  const getDateOrActionText = (date, lang) => {
    if (date === 'Action Required') return lang === 'KN' ? 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ' : lang === 'HI' ? 'कार्रवाई आवश्यक' : 'Action Required';
    if (date.includes('Aug')) return lang === 'KN' ? 'ಆಗಸ್ಟ್ 2024' : lang === 'HI' ? 'अगस्त 2024' : date;
    if (date.includes('Jul')) return lang === 'KN' ? 'ಜುಲೈ 2024' : lang === 'HI' ? 'जुलाई 2024' : date;
    return date;
  };

  return (
    <div className="animate-fade-in glass-card" style={{ padding: '1.5rem' }}>
      <h3 className="section-title">{t('ngo_verif_status', language)}</h3>
      <div className="space-y-4">
        {[
          { ngo: 'Global Green Initiative', status: 'Verified', date: 'Aug 2024' },
          { ngo: 'EduCare Foundation', status: 'Verified', date: 'Jul 2024' },
          { ngo: 'HealthFirst NGO', status: 'Pending', date: 'Action Required' }
        ].map((item, i) => (
          <div key={i} className="list-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {item.status === 'Verified'
                  ? <CheckCircle size={18} style={{ color: 'var(--color-secondary)' }} />
                  : <Target size={18} style={{ color: 'var(--color-warning)' }} />}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0 }}>{getNgoTranslation(item.ngo, language)}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {t('last_audit', language)} {getDateOrActionText(item.date, language)}
                </p>
              </div>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>{t('view_docs', language)}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── CSR Reports ─── */
const CsrReports = () => {
  const { language } = useLanguage();
  return (
    <div className="animate-fade-in glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
      }}>
        <FileText size={32} style={{ color: 'var(--color-primary)' }} />
      </div>
      <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('csr_reports_title', language)}</h2>
      <p style={{ fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
        {t('csr_reports_desc', language)}
      </p>
      <button className="btn btn-primary"><TrendingUp size={16} /> {t('gen_q3_report', language)}</button>
    </div>
  );
};

/* ─── Company Dashboard ─── */
const CompanyDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('funding');

  const tabs = [
    { id: 'funding', label: t('tab_funding_portal', language) },
    { id: 'diligence', label: t('tab_due_diligence', language) },
    { id: 'reports', label: t('tab_csr_reports', language) }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="text-gradient">{t('corp_portal_title', language)}</h1>
        <p>{t('manage_csr_impact', language)} <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name}</span></p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 400 }}>
        {activeTab === 'funding' && <FundingPortal />}
        {activeTab === 'diligence' && <DueDiligence />}
        {activeTab === 'reports' && <CsrReports />}
      </div>
    </div>
  );
};

export default CompanyDashboard;
