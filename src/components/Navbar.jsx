import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';

const PARK_LINKS = [
  { label: 'Inicio',        id: 'inicio'        },
  { label: 'El Parque',     id: 'info'           },
  { label: 'Juegos',        id: 'juegos'         },
  { label: 'Mapa',          id: 'mapa'           },
  { label: 'Accesibilidad', id: 'accesibilidad'  },
  { label: 'Reseñas',       id: 'resenas'        },
];

export default function Navbar({ park, onHome, onAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const accentColor = park?.color || '#0284C7';
  const accentColor2 = park?.color2 || '#38BDF8';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '10px 48px' : '18px 48px',
        background: (scrolled || !park) ? 'rgba(255,255,255,.94)' : 'transparent',
        backdropFilter: (scrolled || !park) ? 'blur(20px)' : 'none',
        borderBottom: (scrolled || !park) ? '1px solid #E2E8F0' : 'none',
        boxShadow: (scrolled || !park) ? '0 2px 16px rgba(0,0,0,.06)' : 'none',
        transition: 'all .35s ease',
      }}>
        {/* Logo */}
        <button onClick={() => { onHome(); setOpen(false); }} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          {park ? (
            <>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg,${accentColor},${accentColor2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 10px ${accentColor}44`,
                fontSize: 18,
              }}>
                <span>{park.emoji}</span>
              </div>
              <span style={{
                fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16,
                color: '#0F172A', letterSpacing: '-.3px',
              }}>
                {park.name}
              </span>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src="/image(1).png" alt="Volcano Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
              <img src="/PLAY YAIZA sin parques.png" alt="PlayYaiza Logo" style={{ height: 42, objectFit: 'contain' }} />
            </div>
          )}
        </button>

        {/* Desktop links — only in park detail */}
        {park && (
          <ul style={{ display: 'flex', gap: 28, listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}
            className="nav-links">
            {PARK_LINKS.map(l => (
              <li key={l.id}>
                <button onClick={() => go(l.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: '#475569',
                  fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: '.1px',
                  transition: 'color .2s', padding: '2px 0',
                }}
                  onMouseEnter={e => e.target.style.color = accentColor}
                  onMouseLeave={e => e.target.style.color = '#475569'}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

          <button onClick={onAdmin} className="nav-admin" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(15,23,42,.05)', border: '1px solid #E2E8F0',
            borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', color: '#64748B', fontFamily: 'Plus Jakarta Sans,sans-serif',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,.1)'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,.05)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
            <ShieldCheck size={13} /> Admin
          </button>
        </div>

        {/* Hamburger */}
        <button className="nav-ham" onClick={() => setOpen(v => !v)} style={{
          display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A', padding: 4,
        }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 190,
        background: 'rgba(255,255,255,.98)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
      }}>
        {(park ? PARK_LINKS : [{ label: 'Inicio', id: 'home' }]).map(l => (
          <button key={l.id} onClick={() => l.id === 'home' ? (onHome(), setOpen(false)) : go(l.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800,
              color: '#0F172A', padding: '10px 60px', transition: 'color .2s',
            }}
            onMouseEnter={e => e.target.style.color = accentColor}
            onMouseLeave={e => e.target.style.color = '#0F172A'}>
            {l.label}
          </button>
        ))}
        <button onClick={() => { onAdmin(); setOpen(false); }} style={{
          marginTop: 16, display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(15,23,42,.05)', border: '1px solid #E2E8F0',
          borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', color: '#64748B',
        }}>
          <ShieldCheck size={16} /> Panel Admin
        </button>
      </div>

      <style>{`
        @media(max-width:900px){
          .nav-links,.nav-cta{ display:none !important }
          .nav-ham{ display:block !important }
          .nav-admin{ display:none !important }
          nav{ padding:14px 24px !important }
        }
      `}</style>
    </>
  );
}
