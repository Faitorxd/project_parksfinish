/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Navigation, MapPin, Clock } from 'lucide-react';
import useInView from '../hooks/useInView';

export default function MapSection({ park }) {
  const mapEl  = useRef(null);
  const mapObj = useRef(null);
  const [hRef, hVis] = useInView();
  const [mRef, mVis] = useInView();

  const popupStyle = (color) => `
    <style>
      .lf-popup .leaflet-popup-content-wrapper {
        border-radius: 14px !important;
        box-shadow: 0 8px 30px rgba(0,0,0,.14) !important;
        padding: 0 !important;
        overflow: hidden !important;
        border: 1.5px solid ${color}28 !important;
      }
      .lf-popup .leaflet-popup-content { margin: 0 !important; width: auto !important; }
      .lf-popup .leaflet-popup-tip-container { margin-top: -2px !important; }
      .lf-popup .leaflet-popup-tip { background: white !important; box-shadow: none !important; }
    </style>
  `;

  const buildPopup = (pt, color) => {
    const photoHtml = pt.photo
      ? `<img src="${pt.photo}" style="width:100%;height:110px;object-fit:cover;display:block"/>`
      : '';
    const titleColor = pt.color || color;
    return `
      ${popupStyle(titleColor)}
      <div style="width:220px;font-family:'Plus Jakarta Sans',sans-serif;">
        ${photoHtml}
        <div style="padding:12px 14px 14px;">
          <div style="font-size:13px;font-weight:800;color:${titleColor};margin-bottom:4px;">
            ${pt.emoji || ''} ${pt.title || pt.label || ''}
          </div>
          <div style="font-size:11px;color:#64748B;line-height:1.5;">${pt.desc || pt.description || ''}</div>
        </div>
      </div>`;
  };

  useEffect(() => {
    if (!mVis || mapObj.current) return;
    const L = window.L;
    if (!L) return;

    mapObj.current = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: false })
      .setView([park.lat, park.lng], 16.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapObj.current);

    // Area circle
    L.circle([park.lat, park.lng], {
      radius: 80, color: park.color, fillColor: park.color,
      fillOpacity: .12, weight: 2.5, dashArray: '7,5',
    }).addTo(mapObj.current);

    // Main park pin
    const mainIcon = L.divIcon({
      html: `<div style="width:48px;height:48px;border-radius:50%;background:${park.color};border:3px solid white;box-shadow:0 3px 14px ${park.color}66;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer">${park.emoji}</div>`,
      iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -52], className: '',
    });
    L.marker([park.lat, park.lng], { icon: mainIcon })
      .addTo(mapObj.current)
      .bindPopup(buildPopup(
        { title: park.name, desc: park.address, photo: park.coverUrl, emoji: park.emoji, color: park.color },
        park.color
      ), { className: 'lf-popup', maxWidth: 240 });

    // Zone markers
    park.mapPoints.forEach(pt => {
      const sz = pt.size || 34;
      const icon = L.divIcon({
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${pt.color};border:3px solid white;box-shadow:0 3px 12px ${pt.color}55;display:flex;align-items:center;justify-content:center;font-size:${Math.round(sz * .42)}px;cursor:pointer;transition:transform .18s" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform=''">${pt.emoji}</div>`,
        iconSize: [sz, sz], iconAnchor: [sz / 2, sz], popupAnchor: [0, -sz - 4], className: '',
      });
      L.marker([pt.lat, pt.lng], { icon })
        .addTo(mapObj.current)
        .bindPopup(buildPopup(pt, park.color), { className: 'lf-popup', maxWidth: 240 });
    });

    setTimeout(() => mapObj.current?.invalidateSize(), 150);
  }, [mVis]);

  useEffect(() => () => {
    if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; }
  }, [park.id]);

  const steps = [
    { n: 1, t: 'Conduce o camina', d: `Dirígete a ${park.address}, ${park.city}.` },
    { n: 2, t: 'Aparca fácil',     d: 'Plazas PMR señalizadas justo frente al parque.' },
    { n: 3, t: 'Entra',            d: 'Entradas accesibles y adaptadas.' },
  ];

  return (
    <section id="mapa" style={{ padding: '100px 48px', background: 'white', isolation: 'isolate', position: 'relative', zIndex: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={hRef} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
          alignItems: 'flex-start', marginBottom: 56,
          opacity: hVis ? 1 : 0, transform: hVis ? 'none' : 'translateY(24px)', transition: 'all .6s',
        }} className="map-header-grid">
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)',
              color: '#16A34A', padding: '5px 14px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 14,
            }}>📍 Cómo llegar</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(26px,3.5vw,44px)',
              fontWeight: 800, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: 14 }}>
              Encuéntranos<br />en <span style={{ color: park.color }}>{park.city.split(',')[0]}</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75 }}>
              {park.address} · {park.city}.<br />Con aparcamiento PMR señalizado.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map(s => (
              <div key={s.n} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: '#F8FAFC', borderRadius: 14, padding: '14px 16px', border: '1px solid #F1F5F9',
              }}>
                <div style={{
                  width: 30, height: 30, flexShrink: 0,
                  background: `linear-gradient(135deg,${park.color},${park.color2})`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 800,
                }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
            {(() => {
              const reviews = park.reviews || [];
              const avg = reviews.length
                ? (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1)
                : null;
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.22)',
                  borderRadius: 14, padding: '12px 16px',
                }}>
                  <span style={{ fontSize: 18 }}>⭐</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8',
                      letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 1 }}>Valoración</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#B45309' }}>
                      {avg ? `${avg} / 5 · ${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}` : 'Sin reseñas aún'}
                    </div>
                  </div>
                </div>
              );
            })()}
            <div style={{
              background: '#FAFCFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock size={13} color={park.color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: park.color,
                  letterSpacing: '.5px', textTransform: 'uppercase' }}>Horario orientativo</span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {park.schedule || 'Consultar disponibilidad en el lugar'}
              </div>
            </div>
            <a href={park.mapsUrl} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: `linear-gradient(135deg,${park.color},${park.color2})`,
              color: 'white', textDecoration: 'none', borderRadius: 12,
              padding: '13px', fontSize: 14, fontWeight: 700,
              boxShadow: `0 6px 20px ${park.color}33`,
              fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'transform .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <Navigation size={16} /> Abrir en Google Maps
            </a>
          </div>
        </div>

        {/* Map */}
        <div ref={mRef} style={{
          borderRadius: 24, overflow: 'hidden',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 8px 40px rgba(0,0,0,.07)',
          opacity: mVis ? 1 : 0, transform: mVis ? 'none' : 'translateY(24px)',
          transition: 'all .7s .15s',
        }}>
          {/* Top bar */}
          <div style={{
            padding: '14px 20px', background: 'white', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 0 3px rgba(34,197,94,.18)', animation: 'pulse 2s infinite',
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{park.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{park.address}</div>
              </div>
            </div>
            <a href={park.mapsUrl} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${park.color}12`, color: park.color,
              border: `1.5px solid ${park.color}28`, borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 700,
              textDecoration: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif',
            }}><MapPin size={12} /> Ir al parque</a>
          </div>

          {/* Leaflet container */}
          <div ref={mapEl} style={{ height: 460, width: '100%' }} />

          {/* Legend */}
          <div style={{
            padding: '12px 20px', background: '#FAFCFF', borderTop: '1px solid #F1F5F9',
            display: 'flex', gap: 20, flexWrap: 'wrap',
          }}>
            {[
              [park.color,  park.name],
              ['#16A34A',   'Entradas accesibles'],
              ['#D97706',   'Parking PMR'],
              ['#8B5CF6',   'Juegos y Atracciones'],
              ['#0EA5E9',   'Zonas de descanso'],
            ].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, flexShrink: 0 }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media(max-width:900px){
          .map-header-grid{ grid-template-columns:1fr !important; gap:32px !important }
          #mapa{ padding:60px 20px !important }
        }
      `}</style>
    </section>
  );
}
