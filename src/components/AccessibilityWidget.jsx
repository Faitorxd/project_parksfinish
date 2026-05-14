import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   AccessibilityWidget
   Todos los ajustes se persisten en localStorage con la clave "aw_prefs"
   → sobreviven cambios de vista (Home → Park → Home) y recargas de página.
──────────────────────────────────────────────────────────────────────────── */

const IMG_STEP = 15;
const IMG_MIN  = 50;
const IMG_MAX  = 200;
const LS_KEY   = 'aw_prefs';   // localStorage key

const CONTRAST_PRESETS = [
  { id: 'normal', label: 'Normal',          swatch: '#ffffff', filter: 'none' },
  { id: 'dark',   label: 'Fondo oscuro',    swatch: '#1e1e2e', filter: 'invert(1) hue-rotate(180deg)' },
  { id: 'highc',  label: 'Alto contraste',  swatch: '#000000', filter: 'contrast(2) brightness(0.9)' },
  { id: 'warm',   label: 'Cálido',          swatch: '#fff3cd', filter: 'sepia(0.4) brightness(1.05)' },
  { id: 'blue',   label: 'Azul suave',      swatch: '#dbeafe', filter: 'hue-rotate(200deg) saturate(0.7) brightness(1.1)' },
  { id: 'mono',   label: 'Escala de grises',swatch: '#94a3b8', filter: 'grayscale(1)' },
];

/* ── Helpers: leer / escribir preferencias ─────────────────────────────── */
function loadPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { imgScale: 100, readable: false, contrastId: 'normal', underline: false };
}

function savePrefs(prefs) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(prefs)); } catch (_) {}
}

/* ── Aplicar estilos al DOM (sin React, se pueden llamar antes del render) */
function applyImgScaleStyle(scale) {
  let el = document.getElementById('aw-img-style');
  if (!el) { el = document.createElement('style'); el.id = 'aw-img-style'; document.head.appendChild(el); }
  el.textContent = scale === 100 ? '' : `
    img:not([data-aw-skip]) {
      transform: scale(${scale / 100}) !important;
      transform-origin: top left !important;
    }`;
}

function applyContrastStyle(contrastId) {
  const preset = CONTRAST_PRESETS.find(p => p.id === contrastId) || CONTRAST_PRESETS[0];
  let el = document.getElementById('aw-contrast-style');
  if (!el) { el = document.createElement('style'); el.id = 'aw-contrast-style'; document.head.appendChild(el); }
  el.textContent = preset.filter === 'none' ? '' : `html { filter: ${preset.filter} !important; }`;
}

function applyReadableStyle(readable) {
  document.documentElement.style.fontFamily = readable
    ? '"Comic Sans MS", "Trebuchet MS", Arial, sans-serif'
    : '';
}

function applyUnderlineStyle(underline) {
  let el = document.getElementById('aw-underline-style');
  if (!el) { el = document.createElement('style'); el.id = 'aw-underline-style'; document.head.appendChild(el); }
  el.textContent = underline ? 'a { text-decoration: underline !important; text-underline-offset: 3px; }' : '';
}

/* ── Aplicar todo de golpe (útil al montar) ────────────────────────────── */
function applyAllPrefs(prefs) {
  applyImgScaleStyle(prefs.imgScale);
  applyContrastStyle(prefs.contrastId);
  applyReadableStyle(prefs.readable);
  applyUnderlineStyle(prefs.underline);
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function AccessibilityWidget() {
  // Inicializar estado DESDE localStorage directamente
  const saved = loadPrefs();
  const [open,       setOpen]       = useState(false);
  const [imgScale,   setImgScale]   = useState(saved.imgScale);
  const [readable,   setReadable]   = useState(saved.readable);
  const [contrastId, setContrastId] = useState(saved.contrastId);
  const [underline,  setUnderline]  = useState(saved.underline);
  const [showColors, setShowColors] = useState(false);
  const panelRef = useRef(null);

  /* Al montar: aplicar preferencias guardadas al DOM inmediatamente */
  useEffect(() => {
    applyAllPrefs(loadPrefs());
  }, []); // eslint-disable-line

  /* Cada vez que cambia imgScale → aplicar + guardar */
  useEffect(() => {
    applyImgScaleStyle(imgScale);
    savePrefs({ imgScale, readable, contrastId, underline });
  }, [imgScale]); // eslint-disable-line

  /* Cada vez que cambia readable → aplicar + guardar */
  useEffect(() => {
    applyReadableStyle(readable);
    savePrefs({ imgScale, readable, contrastId, underline });
  }, [readable]); // eslint-disable-line

  /* Cada vez que cambia contrastId → aplicar + guardar */
  useEffect(() => {
    applyContrastStyle(contrastId);
    savePrefs({ imgScale, readable, contrastId, underline });
  }, [contrastId]); // eslint-disable-line

  /* Cada vez que cambia underline → aplicar + guardar */
  useEffect(() => {
    applyUnderlineStyle(underline);
    savePrefs({ imgScale, readable, contrastId, underline });
  }, [underline]); // eslint-disable-line

  /* Cerrar panel al clic fuera */
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        setShowColors(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Reset → limpiar localStorage + DOM */
  const reset = useCallback(() => {
    const defaults = { imgScale: 100, readable: false, contrastId: 'normal', underline: false };
    setImgScale(defaults.imgScale);
    setReadable(defaults.readable);
    setContrastId(defaults.contrastId);
    setUnderline(defaults.underline);
    setShowColors(false);
    savePrefs(defaults);
    applyAllPrefs(defaults);
  }, []);

  /* ── Estilos compartidos ─────────────────────────────────────────── */
  const btn = (active = false) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: active ? '1.5px solid #0284C7' : '1.5px solid #E2E8F0',
    background: active ? '#0284C7' : '#F8FAFC',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    color: active ? 'white' : '#1E293B',
    transition: 'all .18s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  });

  const currentPreset = CONTRAST_PRESETS.find(p => p.id === contrastId) || CONTRAST_PRESETS[0];
  const hasChanges = imgScale !== 100 || readable || contrastId !== 'normal' || underline;

  return (
    <>
      {/* ── Botón flotante ─────────────────────────────────────────── */}
      <button
        id="accessibility-widget-btn"
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
        onClick={() => { setOpen(v => !v); setShowColors(false); }}
        style={{
          position: 'fixed',
          bottom: 88,
          left: 20,
          zIndex: 9999,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '2.5px solid #0284C7',
          background: open ? '#0284C7' : 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasChanges
            ? '0 4px 18px rgba(2,132,199,.6), 0 0 0 3px rgba(2,132,199,.2)'
            : '0 4px 18px rgba(2,132,199,.35)',
          transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke={open ? 'white' : '#0284C7'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="1.5"/>
          <path d="M9 9h5l1 5H9.5"/>
          <path d="M9 9L7 13"/>
          <path d="M9.5 14C9 16 6.8 17.5 4.5 17.5"/>
          <path d="M14.5 14C15 16 17.2 17.5 19.5 17.5"/>
        </svg>
        {/* Indicador de ajustes activos */}
        {hasChanges && !open && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 14, height: 14, borderRadius: '50%',
            background: '#16A34A', border: '2px solid white',
          }}/>
        )}
      </button>

      {/* ── Panel ──────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panel de accesibilidad"
        style={{
          position: 'fixed',
          bottom: 150,
          left: 20,
          zIndex: 10000,
          width: 256,
          background: 'rgba(255,255,255,0.99)',
          backdropFilter: 'blur(24px)',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,.16), 0 0 0 1.5px #E2E8F0',
          overflow: 'hidden',
          transform: open ? 'scale(1) translateY(0)' : 'scale(.9) translateY(20px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform .28s cubic-bezier(.4,0,.2,1), opacity .22s',
          transformOrigin: 'bottom left',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#0284C7,#38BDF8)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="4" r="1.5"/>
              <path d="M9 9h5l1 5H9.5"/>
              <path d="M9 9L7 13"/>
              <path d="M9.5 14C9 16 6.8 17.5 4.5 17.5"/>
              <path d="M14.5 14C15 16 17.2 17.5 19.5 17.5"/>
            </svg>
            <span style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800 }}>
              Accesibilidad
            </span>
          </div>
          <button
            aria-label="Cerrar panel"
            onClick={() => { setOpen(false); setShowColors(false); }}
            style={{
              background: 'rgba(255,255,255,.22)', border: 'none', borderRadius: 8,
              color: 'white', cursor: 'pointer', padding: '4px 10px',
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            }}
          >
            Cerrar ✕
          </button>
        </div>

        {/* Aviso de persistencia cuando hay cambios activos */}
        {hasChanges && (
          <div style={{
            background: '#F0FDF4', borderBottom: '1px solid #BBF7D0',
            padding: '7px 14px', fontSize: 11, fontWeight: 600,
            color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            <span>●</span> Ajustes activos — se mantienen al cambiar de vista
          </div>
        )}

        {/* Controles */}
        <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 1. Redimensionar imagen */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Redimensionar imagen
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                aria-label="Reducir tamaño de imágenes"
                onClick={() => setImgScale(s => Math.max(IMG_MIN, s - IMG_STEP))}
                style={{ ...btn(), flex: 1, fontSize: 16, fontWeight: 900 }}
                onMouseEnter={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor='#0284C7'; e.currentTarget.style.color='#0284C7'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.color='#1E293B'; }}
              >A−</button>

              <span style={{
                fontSize: 12, fontWeight: 700,
                color: imgScale === 100 ? '#94A3B8' : '#0284C7',
                minWidth: 38, textAlign: 'center', fontFamily: 'monospace',
              }}>{imgScale}%</span>

              <button
                aria-label="Aumentar tamaño de imágenes"
                onClick={() => setImgScale(s => Math.min(IMG_MAX, s + IMG_STEP))}
                style={{ ...btn(), flex: 1, fontSize: 16, fontWeight: 900 }}
                onMouseEnter={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor='#0284C7'; e.currentTarget.style.color='#0284C7'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.color='#1E293B'; }}
              >A+</button>
            </div>
          </div>

          {/* 2. Fuente legible */}
          <button aria-pressed={readable} onClick={() => setReadable(v => !v)} style={btn(readable)}>
            <span style={{ fontFamily: readable ? 'Comic Sans MS' : 'inherit', fontSize: 15 }}>Aa</span>
            Fuente legible
          </button>

          {/* 3. Contraste */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Contraste
            </div>
            <button
              aria-expanded={showColors}
              aria-label="Elegir modo de contraste"
              onClick={() => setShowColors(v => !v)}
              style={{ ...btn(contrastId !== 'normal'), justifyContent: 'space-between', paddingLeft: 12, paddingRight: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, background: currentPreset.swatch, border: '1.5px solid #CBD5E1', display: 'inline-block', flexShrink: 0 }}/>
                <span>{currentPreset.label}</span>
              </div>
              <span style={{ fontSize: 10, opacity: .7 }}>{showColors ? '▲' : '▼'}</span>
            </button>

            {showColors && (
              <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {CONTRAST_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    aria-pressed={contrastId === preset.id}
                    onClick={() => { setContrastId(preset.id); setShowColors(false); }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      padding: '8px 6px', borderRadius: 10, cursor: 'pointer',
                      border: contrastId === preset.id ? '2px solid #0284C7' : '1.5px solid #E2E8F0',
                      background: contrastId === preset.id ? '#EFF6FF' : '#F8FAFC',
                      transition: 'all .15s',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                    onMouseEnter={e => { if (contrastId !== preset.id) { e.currentTarget.style.background='#F1F5F9'; e.currentTarget.style.borderColor='#CBD5E1'; }}}
                    onMouseLeave={e => { if (contrastId !== preset.id) { e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#E2E8F0'; }}}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: preset.swatch, border: '2px solid #CBD5E1', display: 'block', boxShadow: contrastId === preset.id ? '0 0 0 2px #0284C7' : 'none' }}/>
                    <span style={{ fontSize: 10, fontWeight: 700, color: contrastId === preset.id ? '#0284C7' : '#64748B', textAlign: 'center', lineHeight: 1.2 }}>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Subrayar enlaces */}
          <button aria-pressed={underline} onClick={() => setUnderline(v => !v)} style={btn(underline)}>
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 3, fontSize: 15 }}>A</span>
            Subrayar enlaces
          </button>

          {/* 5. Restaurar valores */}
          <button
            onClick={reset}
            style={{ ...btn(), background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', marginTop: 2 }}
            onMouseEnter={e => { e.currentTarget.style.background='#FEE2E2'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#FEF2F2'; }}
          >
            ↺ Restaurar valores
          </button>
        </div>
      </div>
    </>
  );
}
