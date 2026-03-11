import React from 'react';
import { MapPin, ExternalLink, TreePine } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio',        id: 'inicio'        },
  { label: 'El Parque',     id: 'info'           },
  { label: 'Juegos',        id: 'juegos'         },
  { label: 'Mapa',          id: 'mapa'           },
  { label: 'Accesibilidad', id: 'accesibilidad'  },
  { label: 'Reseñas',       id: 'resenas'        },
];

export default function Footer({ park, onHome }) {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ background: '#0F172A', color: 'white', padding: '64px 48px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48,
          marginBottom: 56, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.08)',
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <button onClick={onHome} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: `linear-gradient(135deg,${park?.color || '#0284C7'},${park?.color2 || '#38BDF8'})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 10px ${park?.color || '#0284C7'}55`,
                fontSize: park ? 18 : 0,
              }}>
                {park ? park.emoji : <TreePine size={18} color="white" strokeWidth={2.5} />}
              </div>
              <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 800 }}>
                {park ? park.name : 'Parques Inclusivos'}
              </span>
            </button>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,.5)', maxWidth: 300, marginBottom: 20 }}>
              {park
                ? park.description.slice(0, 120) + '…'
                : 'Red de parques infantiles 100% inclusivos en Madrid, donde todos los niños juegan juntos.'}
            </p>
            {park && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,.45)' }}>
                <MapPin size={13} /> {park.address}, {park.city}
              </div>
            )}
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)',
              letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 16 }}>Navegación</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(park ? NAV_LINKS : [{ label: 'Inicio', id: 'home' }]).map(l => (
                <button key={l.id}
                  onClick={() => l.id === 'home' ? onHome() : go(l.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
                    fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500,
                    fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'color .2s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)',
              letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 16 }}>Recursos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Google Maps',        href: park?.mapsUrl || 'https://maps.google.com' },
                { label: 'Parques Inclusivos', href: 'https://www.parquesinfantilesinclusivos.es' },
                { label: 'Ayuntamiento',       href: 'https://www.madrid.es' },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, color: 'rgba(255,255,255,.5)', textDecoration: 'none', fontWeight: 500,
                  transition: 'color .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                  <ExternalLink size={12} /> {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'rgba(255,255,255,.28)',
        }}>
          <span>© 2025 Parques Inclusivos · Madrid</span>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          .footer-grid{ grid-template-columns:1fr !important; gap:32px !important }
          footer{ padding:48px 24px 28px !important }
        }
      `}</style>
    </footer>
  );
}
