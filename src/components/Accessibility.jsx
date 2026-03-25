import React from 'react';
import useInView from '../hooks/useInView';

export default function Accessibility({ park }) {
  const [hRef, hVis] = useInView();

  const formatText = (text) => {
    if (typeof text !== 'string') return text;
    if (!text.includes('♿')) return text;
    const parts = text.split('♿');
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && <img src="/Grupo.svg" alt="Inclusivo" style={{ width: '1.2em', height: '1.2em' }} />}
          </React.Fragment>
        ))}
      </span>
    );
  };

  const ACCESS = park.tags.length
    ? park.tags.map((tag, i) => {
        const lowerTag = tag.toLowerCase();
        let emoji = '✅';
        let color = '#0284C7';
        let light = '#EFF6FF';
        
        if (lowerTag.includes('inclusiv') || tag.includes('♿') || lowerTag.includes('silla')) {
            emoji = <img src="/Grupo.svg" alt="Inclusivo" style={{ width: 24, height: 24 }} />;
            color = '#0284C7'; light = '#EFF6FF';
        } else if (lowerTag.includes('parking') || tag.includes('🅿️') || lowerTag.includes('aparcamiento') || lowerTag.includes('pmr')) {
            emoji = '🅿️'; color = '#D97706'; light = '#FFFBEB';
        } else if (lowerTag.includes('caucho') || tag.includes('🌿')) {
            emoji = '🌿'; color = '#16A34A'; light = '#F0FDF4';
        } else if (lowerTag.includes('entrada') || tag.includes('🚪')) {
            emoji = '🚪'; color = '#7C3AED'; light = '#F5F3FF';
        } else if (lowerTag.includes('braille') || tag.includes('👁️')) {
            emoji = '👁️'; color = '#475569'; light = '#F8FAFC';
        } else if (lowerTag.includes('plano') || tag.includes('🗺️')) {
            emoji = '🗺️'; color = '#0891B2'; light = '#ECFEFF';
        } else if (lowerTag.includes('juego') || tag.includes('🎯')) {
            emoji = '🎯'; color = '#DC2626'; light = '#FEF2F2';
        } else if (lowerTag.includes('sonido') || tag.includes('🔊')) {
            emoji = '🔊'; color = '#0D9488'; light = '#F0FDFA';
        } else {
            const presets = [
              { emoji: <img src="/Grupo.svg" alt="Inclusivo" style={{ width: 24, height: 24 }} />, color: '#0284C7', light: '#EFF6FF' },
              { emoji: '🅿️', color: '#D97706', light: '#FFFBEB' },
              { emoji: '🌿', color: '#16A34A', light: '#F0FDF4' },
              { emoji: '🚪', color: '#7C3AED', light: '#F5F3FF' },
              { emoji: '👁️', color: '#475569', light: '#F8FAFC' },
              { emoji: '🗺️', color: '#0891B2', light: '#ECFEFF' },
              { emoji: '🎯', color: '#DC2626', light: '#FEF2F2' },
              { emoji: '🔊', color: '#0D9488', light: '#F0FDFA' },
            ];
            const p = presets[i % presets.length];
            emoji = p.emoji; color = p.color; light = p.light;
        }

        return { emoji, title: formatText(tag), desc: formatText(`Característica de accesibilidad: ${tag}`), color, light };
      })
    : [
        { emoji: <img src="/Grupo.svg" alt="Inclusivo" style={{ width: 24, height: 24 }} />, title: 'Sillas de ruedas',  desc: 'Espacios amplios y pavimento continuo apto para sillas.',         color: '#0284C7', light: '#EFF6FF' },
        { emoji: '🅿️', title: 'Parking PMR',       desc: 'Plazas señalizadas para movilidad reducida frente al parque.',    color: '#D97706', light: '#FFFBEB' },
        { emoji: '🌿', title: 'Pavimento caucho',  desc: 'Superficie continua de caucho para circulación cómoda y segura.', color: '#16A34A', light: '#F0FDF4' },
        { emoji: '🚪', title: 'Entradas',          desc: 'Todos los accesos con paso fácil para sillas de ruedas.',         color: '#7C3AED', light: '#F5F3FF' },
        { emoji: '👁️', title: 'Panel Braille',     desc: 'Aprende Braille jugando. Panel a la altura de una silla.',        color: '#475569', light: '#F8FAFC' },
        { emoji: '🗺️', title: 'Planos en relieve', desc: 'Señalética inclusiva en cada entrada con planos en relieve.',     color: '#0891B2', light: '#ECFEFF' },
      ];

  return (
    <section id="accesibilidad" style={{ padding: '100px 48px', background: '#F8FAFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div ref={hRef} style={{
          textAlign: 'center', marginBottom: 56,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(24px)', transition: 'all .6s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.18)',
            color: '#16A34A', padding: '5px 14px', borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
          }}><img src="/Grupo.svg" alt="Inclusivo" style={{ width: 14, height: 14 }} /> Accesibilidad</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: 12 }}>
            Diseñado para{' '}
            <span style={{ color: '#16A34A' }}>todos sin excepción</span>
          </h2>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Cada detalle ha sido pensado para que ningún niño quede excluido.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {ACCESS.map((a, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [ref, vis] = useInView();
            return (
              <div key={i} ref={ref} style={{
                background: 'white', borderRadius: 20, padding: '24px 22px',
                border: `1.5px solid ${a.light}`,
                boxShadow: '0 2px 10px rgba(0,0,0,.04)',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)',
                transition: `all .5s ${i * 60}ms`,
              }}>
                <div style={{
                  width: 48, height: 48, flexShrink: 0,
                  background: a.light, border: `1.5px solid ${a.color}25`,
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, boxShadow: `0 4px 10px ${a.color}12`,
                }}>{a.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700,
                    color: '#0F172A', marginBottom: 5 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{a.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <style>{`@media(max-width:640px){#accesibilidad{padding:60px 20px !important}}`}</style>
    </section>
  );
}
