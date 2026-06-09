import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/predict', label: 'New Prediction' },
  { to: '/history', label: 'History' },
  { to: '/barrels', label: 'Barrels' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      background: 'var(--burgundy)',
      borderBottom: '3px solid var(--gold)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🍷</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 20,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.01em',
          }}>
            VinoPredictus
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? 'var(--charcoal)' : 'rgba(255,255,255,0.85)',
                  background: active ? 'var(--gold)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
