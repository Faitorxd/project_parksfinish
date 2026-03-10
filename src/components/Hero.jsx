import React, { useState } from 'react';
import { MapPin, ChevronDown, Award, Star } from 'lucide-react';
import useInView from '../hooks/useInView';

function ParkCard({ park, delay, onClick }) {
  const [ref, vis] = useInView();
  const [hov, setHov] = useState(false);

  return (
    <div ref={ref} onClick={() => onClick(park)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? park.color + '08' : 'white',
        border: `1.5px solid ${hov ? park.color + '40' : '#F1F5F9'}`,
        borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
        opacity: vis ? 1 : 0,
        transform: vis ? (hov ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(26px)',
        transition: `all .45s ${delay}ms`,
        boxShadow: hov ? `0 20px 50px ${park.color}22` : '0 4px 18px rgba(0,0,0,.06)',
      }}>

      {/* Cover */}
      <div style={{
        height: 200, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(140deg,${park.color},${park.color2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {park.coverUrl
          ? <img src={park.coverUrl} alt={park.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .5s' }} />
          : <>
              <div style={{ position: 'absolute', inset: 0, opacity: .2,
                backgroundImage: 'radial-gradient(rgba(255,255,255,.7) 1px,transparent 1px)',
                backgroundSize: '18px 18px' }} />
              <span style={{ fontSize: 76, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.2))',
                animation: 'float 3s ease-in-out infinite' }}>{park.emoji}</span>
            </>
        }
        {/* Badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 800,
          color: '#92400E', border: '1px solid #FDE68A',
        }}>{park.badge}</div>
        {/* Rating */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)',
          borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700,
          color: 'white', display: 'flex', gap: 4, alignItems: 'center',
        }}>
          <Star size={11} fill="#F59E0B" color="#F59E0B" /> {park.rating}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 800,
          color: '#0F172A', marginBottom: 5, lineHeight: 1.2 }}>{park.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5,
          color: '#64748B', fontSize: 13, marginBottom: 12 }}>
          <MapPin size={12} />{park.city}
        </div>
        <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, marginBottom: 14,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {park.description}
        </p>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {park.tags.slice(0, 3).map((t, i) => (
            <span key={i} style={{
              background: park.color + '12', color: park.color,
              border: `1px solid ${park.color}28`, borderRadius: 20,
              padding: '3px 10px', fontSize: 11, fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 12, borderTop: '1px solid #F8FAFC' }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            🎢 {park.games.length} juegos &nbsp;·&nbsp; 💬 {park.reviewCount}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: park.color }}>Ver más →</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ parks, onParkClick }) {
  const [hRef, hVis] = useInView();
  const active = parks.filter(p => p.active);

  return (
    <section id="inicio" style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg,#F0F9FF 0%,#E0F2FE 30%,#F8FAFF 65%,#FAFCFF 100%)',
      padding: '110px 48px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 640, height: 640,
        background: 'radial-gradient(circle,rgba(56,189,248,.14) 0%,transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 440, height: 440,
        background: 'radial-gradient(circle,rgba(14,165,233,.09) 0%,transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(2,132,199,.1) 1.5px,transparent 1.5px)',
        backgroundSize: '38px 38px', opacity: .65 }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={hRef} style={{
          textAlign: 'center', marginBottom: 64,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(28px)', transition: 'all .7s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(2,132,199,.1)', border: '1px solid rgba(2,132,199,.22)',
            color: '#0284C7', padding: '6px 14px', borderRadius: 30,
            fontSize: 11, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 22,
          }}>
            <Award size={12} /> Red de Parques Inclusivos · Madrid
          </div>
          <h1 style={{
            fontFamily: 'Syne,sans-serif', fontWeight: 800,
            fontSize: 'clamp(36px,5vw,68px)', lineHeight: 1.05,
            letterSpacing: '-2.5px', color: '#0F172A', marginBottom: 22,
          }}>
            Donde todos los niños<br />
            <span style={{
              background: 'linear-gradient(125deg,#0284C7,#38BDF8,#0EA5E9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>juegan juntos ✈️</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#64748B', maxWidth: 540, margin: '0 auto 36px' }}>
            Descubre nuestra red de parques infantiles{' '}
            <strong style={{ color: '#0284C7', fontWeight: 700 }}>100% inclusivos</strong> en Madrid.
            Diseñados para que todos los niños disfruten juntos, sin importar sus capacidades.
          </p>
          {/* Stats bar */}
          <div style={{
            display: 'inline-flex', background: 'white', borderRadius: 16,
            border: '1px solid #E2E8F0', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,.06)',
          }}>
            {[
              { emoji: '🏞️', value: active.length, label: 'Parques'    },
              { emoji: '🎢', value: '50+',          label: 'Juegos'     },
              { emoji: '♿', value: '100%',          label: 'Accesibles' },
              { emoji: '⭐', value: '4.9',           label: 'Valoración' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '14px 24px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{ fontSize: 20, marginBottom: 3 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parks grid */}
        {active.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏗️</div>
            <p style={{ fontSize: 16, color: '#94A3B8' }}>Próximamente se añadirán parques. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
            {active.map((park, i) => (
              <ParkCard key={park.id} park={park} delay={i * 80} onClick={onParkClick} />
            ))}
          </div>
        )}
      </div>

      {/* Scroll cue */}
      {active.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: '#94A3B8', fontSize: 10, fontWeight: 700, letterSpacing: '.8px',
          animation: 'fadeUp 1s 1.2s both',
        }}>
          EXPLORAR
          <ChevronDown size={18} style={{ animation: 'bounce 1.4s ease-in-out infinite' }} />
        </div>
      )}

      <style>{`
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)}   }
        @media(max-width:640px){ #inicio{ padding:90px 20px 60px !important } }
      `}</style>
    </section>
  );
}
