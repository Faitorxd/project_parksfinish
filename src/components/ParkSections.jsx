import React, { useState } from 'react';
import useInView from '../hooks/useInView';

function SectionBlock({ section, park, index }) {
  const [ref, vis] = useInView();
  const [expandedImg, setExpandedImg] = useState(null);
  const photos = section.photoUrls || [];

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: vis ? 1 : 0,
          transform: vis ? 'none' : 'translateY(32px)',
          transition: `all .6s ease ${index * 0.1}s`,
          marginBottom: 56,
        }}
      >
        {/* Título de la sección */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'inline-block',
            background: `${park.color}12`,
            color: park.color,
            border: `1px solid ${park.color}30`,
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.6px',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            margin: 0,
          }}>
            {section.title}
          </h2>
        </div>

        {/* Contenido de texto */}
        {section.content && (
          <div style={{ marginBottom: photos.length ? 24 : 0 }}>
            {section.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: '#475569',
                margin: '0 0 12px',
              }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Galería de fotos */}
        {photos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: photos.length === 1
              ? '1fr'
              : photos.length === 2
              ? '1fr 1fr'
              : 'repeat(3, 1fr)',
            gap: 12,
          }} className="section-photos-grid">
            {photos.map((url, i) => (
              <div
                key={i}
                onClick={() => setExpandedImg(url)}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  aspectRatio: '4/3',
                  border: `1.5px solid ${park.color}18`,
                  boxShadow: `0 4px 16px ${park.color}10`,
                  position: 'relative',
                }}
              >
                <img
                  src={url}
                  alt={`${section.title} foto ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform .35s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '28px 12px 8px',
                  background: 'linear-gradient(to top, rgba(0,0,0,.45), transparent)',
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    color: 'rgba(255,255,255,.85)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '.4px',
                  }}>
                    Foto {i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {expandedImg && (
        <div
          onClick={() => setExpandedImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,.92)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, cursor: 'zoom-out',
            animation: 'secFadeIn .2s ease-out',
          }}
        >
          <img
            src={expandedImg}
            alt="Ampliada"
            style={{
              maxWidth: '100%', maxHeight: '100%',
              borderRadius: 20,
              boxShadow: '0 24px 80px rgba(0,0,0,.6)',
              animation: 'secZoomIn .2s ease-out',
            }}
          />
          <div style={{
            position: 'absolute', top: 24, right: 32,
            color: 'rgba(255,255,255,.6)', fontSize: 48, fontWeight: 300,
          }}>
            &times;
          </div>
        </div>
      )}
    </>
  );
}

export default function ParkSections({ park }) {
  const sections = park.sections || [];
  if (!sections.length) return null;

  return (
    <section style={{
      padding: '80px 48px 40px',
      background: 'linear-gradient(180deg, #FAFCFF 0%, white 100%)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header de la sección global */}
        <div style={{ marginBottom: 52, textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${park.color}12`, border: `1px solid ${park.color}28`,
            color: park.color, padding: '5px 16px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: '.8px',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            📖 Información del parque
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(24px, 3.5vw, 38px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-1px',
            lineHeight: 1.15,
          }}>
            Conoce el parque <span style={{ color: park.color }}>a fondo</span>
          </h2>
        </div>

        {/* Línea separadora con acento de color */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${park.color}, ${park.color2}, transparent)`,
          borderRadius: 4,
          marginBottom: 52,
          maxWidth: 200,
        }} />

        {/* Secciones individuales */}
        {sections.map((section, i) => (
          <React.Fragment key={section.id || i}>
            <SectionBlock section={section} park={park} index={i} />
            {i < sections.length - 1 && (
              <div style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${park.color}30, transparent)`,
                marginBottom: 52,
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes secFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes secZoomIn { from{transform:scale(.95)} to{transform:scale(1)} }
        @media(max-width:700px){
          .section-photos-grid{ grid-template-columns: 1fr 1fr !important; }
          #sections-wrap{ padding: 60px 24px 30px !important; }
        }
        @media(max-width:480px){
          .section-photos-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
