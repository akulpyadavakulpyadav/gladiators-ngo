import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const roles = [
  {
    key: 'ngo',
    path: '/ngo/onboarding',
    image: '/images/ngo_hero.png',
    title: 'NGO',
    description: 'Manage, collaborate & grow',
  },
  {
    key: 'volunteer',
    path: '/volunteer/onboarding',
    image: '/images/volunteer_hero.png',
    title: 'Volunteer',
    description: 'Discover & contribute',
  },
  {
    key: 'company',
    path: '/company/onboarding',
    image: '/images/company_hero.png',
    title: 'Company',
    description: 'CSR & partnerships',
  }
];

const sdgTags = [
  'SDG 16 — Peace & Justice',
  'SDG 17 — Partnerships',
  'SDG 4 — Education',
  'SDG 13 — Climate Action'
];

const LandingPage = () => {
  const navigate = useNavigate();

  // Always scroll to top when landing page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="hero-section" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(107, 143, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(74, 103, 65, 0.2) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* SDG Badge */}
      <div className="sdg-badge animate-fade-in" style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <span>🌱</span>
        <span>SDG 16 &amp; 17 · GLADICONNECT</span>
      </div>

      {/* Logo — full screen width, natural height, no boundary */}
      <div className="animate-fade-in" style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        marginBottom: '0'
      }}>
        {/* Ripple rings centered behind logo */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '35vw', height: '35vw',
            borderRadius: '50%',
            border: `1.5px solid rgba(107,143,94,${0.65 - i * 0.18})`,
            animation: `pulse-spread 2.8s ease-out ${i * 0.9}s infinite`,
            pointerEvents: 'none',
            zIndex: 0
          }} />
        ))}

        {/* Full-width logo, height = natural aspect ratio, no border/clip */}
        <img
          src="/images/logo.png"
          alt="Gladiators NGO Logo"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            mixBlendMode: 'multiply',
            position: 'relative',
            zIndex: 1
          }}
        />
      </div>

      {/* Hero Text */}
      <div style={{
        textAlign: 'center', maxWidth: 800, marginBottom: '3.5rem',
        position: 'relative', zIndex: 1
      }} className="animate-fade-in">
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          color: '#FFFFFF',
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
          fontFamily: "'Playfair Display', serif"
        }}>
          Bridge the gap.
        </h1>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '2rem',
          letterSpacing: '-0.03em',
          fontFamily: "'Playfair Display', serif"
        }}>
          Amplify impact.
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          lineHeight: 1.7,
          color: 'rgba(255, 255, 255, 0.75)',
          maxWidth: 560,
          margin: '0 auto'
        }}>
          The unified platform connecting NGOs, volunteers, and companies to drive collective social impact aligned with UN Sustainable Development Goals.
        </p>
        <p style={{
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: '1rem'
        }}>
          Unite &middot; Empower &middot; Transform
        </p>
      </div>

      {/* Role Cards */}
      <div className="animate-fade-in" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        width: '100%',
        maxWidth: 720,
        marginBottom: '3.5rem',
        position: 'relative', zIndex: 1
      }}>
        {roles.map(role => (
          <div
            key={role.key}
            className="role-card"
            onClick={() => navigate(role.path)}
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{
              width: '100%', height: 160, marginBottom: '1.25rem',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}>
              <img src={role.image} alt={role.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em'
            }}>
              {role.title}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0,
              lineHeight: 1.4
            }}>
              {role.description}
            </p>
          </div>
        ))}
      </div>

      {/* SDG Footer Tags */}
      <div className="animate-fade-in" style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        flexWrap: 'wrap', justifyContent: 'center',
        position: 'relative', zIndex: 1
      }}>
        <span style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 500
        }}>
          Aligned with:
        </span>
        {sdgTags.map((tag, i) => (
          <span key={i} className="sdg-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
