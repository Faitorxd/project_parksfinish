import React, { useState } from 'react';
import { MapPin, ChevronDown, Award } from 'lucide-react';

export default function ParkHero({ park }) {
  const [expandedImg, setExpandedImg] = useState(null);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const hasCover = !!park.coverUrl;

  return (
    <section id="inicio" style={{
      minHeight: '100vh',
      background: hasCover ? '#0F172A'
        : 'linear-gradient(150deg,#F0F9FF 0%,#E0F2FE 30%,#F8FAFF 65%,#FAFCFF 100%)',
      display: 'flex', alignItems: 'center',
      padding: '110px 48px 72px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Cover image */}
      {hasCover && <>
        <img src={park.coverUrl} alt={park.name} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: .55,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg,rgba(15,23,42,.82) 0%,${park.color}55 100%)`,
        }} />
      </>}

      {/* Orbs / dot grid (no cover) */}
      {!hasCover && <>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 640, height: 640,
          background: `radial-gradient(circle,${park.color}22 0%,transparent 70%)`,
          borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(2,132,199,.1) 1.5px,transparent 1.5px)',
          backgroundSize: '38px 38px', opacity: .65 }} />
      </>}

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
      }} className="hero-grid">

        {/* ── LEFT ── */}
        <div style={{ animation: 'fadeUp .7s .1s both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: hasCover ? 'rgba(255,255,255,.15)' : `${park.color}15`,
            border: `1px solid ${hasCover ? 'rgba(255,255,255,.3)' : park.color + '33'}`,
            color: hasCover ? 'white' : park.color,
            padding: '6px 14px', borderRadius: 30, backdropFilter: 'blur(8px)',
            fontSize: 11, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 22,
          }}>
            <Award size={12} /> {park.badge}
          </div>

          <h1 style={{
            fontFamily: 'Syne,sans-serif', fontWeight: 800,
            fontSize: 'clamp(38px,5.2vw,70px)', lineHeight: 1.0,
            letterSpacing: '-2.5px',
            color: hasCover ? 'white' : '#0F172A',
            marginBottom: 22,
            textShadow: hasCover ? '0 2px 20px rgba(0,0,0,.4)' : 'none',
          }}>
            {park.name}<br />
            <span style={{
              background: `linear-gradient(125deg,${park.color},${park.color2})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{park.emoji} {park.city.split(',')[0]}</span>
          </h1>

          <p style={{
            fontSize: 16, lineHeight: 1.85, maxWidth: 460, marginBottom: 36,
            color: hasCover ? 'rgba(255,255,255,.82)' : '#64748B',
          }}>
            {park.description}
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
            <button onClick={() => go('juegos')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg,${park.color},${park.color2})`,
              color: 'white', border: 'none', borderRadius: 12,
              padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans,sans-serif',
              boxShadow: `0 8px 24px ${park.color}44`,
              transition: 'transform .2s,box-shadow .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              🎢 Ver equipamiento
            </button>
            <button onClick={() => go('mapa')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: hasCover ? 'rgba(255,255,255,.12)' : 'white',
              color: hasCover ? 'white' : park.color,
              border: `2px solid ${hasCover ? 'rgba(255,255,255,.35)' : park.color + '44'}`,
              borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', backdropFilter: 'blur(8px)',
              fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all .2s',
            }}>
              <MapPin size={15} /> Ver en el mapa
            </button>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex',
            background: hasCover ? 'rgba(255,255,255,.1)' : 'white',
            backdropFilter: 'blur(12px)',
            borderRadius: 16,
            border: hasCover ? '1px solid rgba(255,255,255,.18)' : '1px solid #E2E8F0',
            overflow: 'hidden', width: 'fit-content',
            boxShadow: '0 4px 20px rgba(0,0,0,.08)',
          }}>
            {[
              { emoji: '🥇', value: park.badge.split(' ')[0], label: 'Premio'     },
              { emoji: '🎢', value: park.games.length,        label: 'Juegos'     },
              { emoji: '♿', value: park.isInclusive ? '100%' : 'No', label: 'Inclusivo'  },
              { emoji: '⭐', value: park.rating,              label: 'Valoración' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '14px 20px', textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${hasCover ? 'rgba(255,255,255,.12)' : '#F1F5F9'}` : 'none',
              }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 800,
                  color: hasCover ? 'white' : '#0F172A' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: hasCover ? 'rgba(255,255,255,.55)' : '#94A3B8',
                  fontWeight: 600, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp .8s .3s both', gap: 20 }}>
          <div style={{ position: 'relative', maxWidth: 400, width: '100%' }}>
            <div style={{
              background: hasCover ? 'rgba(255,255,255,.08)' : 'white', borderRadius: 28,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 24px 80px ${park.color}28`,
              border: `1.5px solid ${hasCover ? 'rgba(255,255,255,.18)' : park.color + '20'}`,
              overflow: 'hidden',
            }}>
              <div style={{
                height: 230, position: 'relative', overflow: 'hidden',
                background: `linear-gradient(140deg,${park.color},${park.color2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ position: 'absolute', inset: 0, opacity: .22,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,.6) 1px,transparent 1px)',
                  backgroundSize: '18px 18px' }} />
                {park.coverUrl
                  ? <img src={park.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 90, zIndex: 1,
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.18))',
                      animation: 'floatEmoji 4s ease-in-out infinite' }}>{park.emoji}</span>
                }
              </div>
              <div style={{ padding: '20px 22px 22px',
                background: hasCover ? 'rgba(15,23,42,.6)' : 'white' }}>
                <span style={{ background: '#FEF9C3', color: '#92400E', border: '1px solid #FDE68A',
                  borderRadius: 20, fontSize: 11, fontWeight: 800, padding: '3px 10px' }}>
                  {park.badge}
                </span>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800,
                  color: hasCover ? 'white' : '#0F172A', margin: '10px 0 4px' }}>{park.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                  color: hasCover ? 'rgba(255,255,255,.6)' : '#64748B', fontSize: 13, marginBottom: 14 }}>
                  <MapPin size={13} /> {park.address}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[['🎢', park.games.length, 'Juegos'], ['♿', park.isInclusive ? '100%' : 'No', 'Accesible'], ['⭐', park.rating, 'Rating']].map(([e, v, l]) => (
                    <div key={l} style={{
                      background: hasCover ? 'rgba(255,255,255,.08)' : '#F8FAFC',
                      borderRadius: 12, padding: '10px 6px', textAlign: 'center',
                      border: hasCover ? '1px solid rgba(255,255,255,.12)' : '1px solid #F1F5F9',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>{e}</div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 800,
                        color: hasCover ? 'white' : '#0F172A' }}>{v}</div>
                      <div style={{ fontSize: 10, color: hasCover ? 'rgba(255,255,255,.45)' : '#94A3B8', fontWeight: 600 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating chips */}
            {park.isInclusive && (
              <div style={{ position: 'absolute', top: -16, right: -22,
                background: 'white', border: '1.5px solid #BBF7D0', borderRadius: 14,
                padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,.1)',
                display: 'flex', alignItems: 'center', gap: 9, animation: 'fadeUp .6s .6s both' }}>
                <span style={{ fontSize: 22 }}>♿</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#15803D' }}>100% Accesible</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Todas las capacidades</div>
                </div>
              </div>
            )}
          </div>

          {/* Fotos adicionales (debajo de la info) */}
          {(park.photo2Url || park.photo3Url) && (
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 400 }}>
              {park.photo2Url && (
                <div 
                  onClick={() => setExpandedImg(park.photo2Url)}
                  style={{ flex: 1, height: 86, borderRadius: 16, overflow: 'hidden', cursor: 'zoom-in', border: `1.5px solid ${hasCover ? 'rgba(255,255,255,.2)' : park.color + '20'}`, boxShadow: '0 8px 24px rgba(0,0,0,.08)' }}
                >
                  <img src={park.photo2Url} alt="Foto extra 2" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                </div>
              )}
              {park.photo3Url && (
                <div 
                  onClick={() => setExpandedImg(park.photo3Url)}
                  style={{ flex: 1, height: 86, borderRadius: 16, overflow: 'hidden', cursor: 'zoom-in', border: `1.5px solid ${hasCover ? 'rgba(255,255,255,.2)' : park.color + '20'}`, boxShadow: '0 8px 24px rgba(0,0,0,.08)' }}
                >
                  <img src={park.photo3Url} alt="Foto extra 3" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <button onClick={() => go('info')} style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        color: hasCover ? 'rgba(255,255,255,.55)' : '#94A3B8',
        fontSize: 10, fontWeight: 700, letterSpacing: '.8px',
        animation: 'fadeUp 1s 1.2s both',
      }}>
        EXPLORAR
        <ChevronDown size={18} style={{ animation: 'bounce 1.4s ease-in-out infinite' }} />
      </button>

      {/* Lightbox */}
      {expandedImg && (
        <div 
          onClick={() => setExpandedImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,.92)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, cursor: 'zoom-out',
            animation: 'fadeIn .2s ease-out'
          }}
        >
          <img src={expandedImg} alt="Ampliada" style={{
            maxWidth: '100%', maxHeight: '100%', borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,.6)',
            animation: 'zoomIn .2s ease-out'
          }} />
          <div style={{ position: 'absolute', top: 24, right: 32, color: 'rgba(255,255,255,.6)', fontSize: 48, fontWeight: 300 }}>&times;</div>
        </div>
      )}

      <style>{`
        @keyframes floatEmoji { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(-3deg)} }
        @keyframes bounce     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
        @keyframes zoomIn     { from{transform:scale(.95)} to{transform:scale(1)} }
        @media(max-width:900px){
          .hero-grid{ grid-template-columns:1fr !important; gap:40px !important }
          .hero-grid>div:last-child{ display:none !important }
          #inicio{ padding:90px 24px 60px !important }
        }
      `}</style>
    </section>
  );
}
