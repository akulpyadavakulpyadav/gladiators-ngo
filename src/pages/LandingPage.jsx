import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Briefcase, ArrowRight } from 'lucide-react';

const roles = [
  {
    key: 'ngo',
    path: '/ngo/onboarding',
    icon: Building2,
    title: 'NGOs',
    color: 'var(--color-primary)',
    bg: 'rgba(26, 82, 118, 0.08)',
    description: 'Register your organization, track volunteers, manage offline events, and report transparent finances.',
    btnClass: 'btn btn-primary',
    btnText: 'Join as NGO'
  },
  {
    key: 'volunteer',
    path: '/volunteer/onboarding',
    icon: Users,
    title: 'Volunteers',
    color: 'var(--color-secondary)',
    bg: 'rgba(30, 132, 73, 0.08)',
    description: 'Find organizations that match your interests, track your impact, and contribute to social growth.',
    btnClass: 'btn btn-secondary',
    btnText: 'Join as Volunteer'
  },
  {
    key: 'company',
    path: '/company/onboarding',
    icon: Briefcase,
    title: 'Corporate Funders',
    color: 'var(--color-text-primary)',
    bg: 'rgba(30, 41, 59, 0.06)',
    description: 'Discover verified NGOs, track CSR funding, and view transparent impact reports.',
    btnClass: 'btn btn-outline',
    btnText: 'Join as Company'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '80vh', padding: '2rem 0'
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 680, marginBottom: '3.5rem' }}>
        <h1 className="text-gradient" style={{ 
          fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, 
          lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em'
        }}>
          Bridging the Gap for Global Goals
        </h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 540, margin: '0 auto' }}>
          Join GladiConnect to connect, collaborate, and achieve UN Sustainable Development Goals 16 &amp; 17.
          Select your role to get started.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-md-3" style={{ width: '100%', maxWidth: 960 }}>
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <div
              key={role.key}
              className="glass-card"
              onClick={() => navigate(role.path)}
              style={{ 
                padding: '2rem', cursor: 'pointer', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
            >
              <div style={{ 
                width: 56, height: 56, borderRadius: '50%', background: role.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
              }}>
                <Icon size={26} style={{ color: role.color }} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: role.color }}>{role.title}</h2>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                {role.description}
              </p>
              <button className={role.btnClass} style={{ width: '100%' }}>
                {role.btnText} <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;
