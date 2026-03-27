import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImageUploader from './ImageUploader';

const TABS = [
  { id: 'basic',    label: '📋 Datos'     },
  { id: 'cover',    label: '📸 Fotos'     },
  { id: 'games',    label: '🎮 Juegos'    },
  { id: 'sports',   label: '💪 Deportes'  },
  { id: 'points',   label: '📍 Mapa'      },
  { id: 'sections', label: '📖 Secciones'  },
];

const PT_OPTS = [
  { v: 'parking',  l: '🅿️ Parking'     },
  { v: 'entrance', l: '🚪 Entrada'      },
  { v: 'games',    l: '🎮 Zona juegos'  },
  { v: 'rest',     l: '🪑 Descanso'     },
];

const PT_COLORS = { parking:'#D97706', entrance:'#16A34A', games:'#0284C7', rest:'#475569' };

function Field({ label, children, required }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B',
        marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>
        {label}{required && <span style={{color:'#EF4444'}}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'10px 14px', border:'1.5px solid #E2E8F0',
  borderRadius:10, fontSize:14, outline:'none', fontFamily:'Plus Jakarta Sans,sans-serif',
  background:'white', color:'#0F172A', transition:'border-color .2s',
};

export default function ParkModal({ mode, park, onSave, onClose }) {
  const isEdit = mode === 'edit';
  const [tab,    setTab]    = useState('basic');
  const [saving, setSaving] = useState(false);

  const [f, setF] = useState({
    name:        park?.name        || '',
    city:        park?.city        || '',
    address:     park?.address     || '',
    lat:         String(park?.lat  || ''),
    lng:         String(park?.lng  || ''),
    description: park?.description || '',
    badge:       park?.badge       || '🏞️ PARQUE',
    emoji:       park?.emoji       || '🌳',
    color:       park?.color       || '#0284C7',
    color2:      park?.color2      || '#38BDF8',
    tags:        Array.isArray(park?.tags) ? park.tags.join(', ') : (park?.tags || ''),
    active:      park?.active !== false,
    youtubeUrl:  park?.youtubeUrl  || '',
    schedule:    park?.schedule    || '',
    isInclusive: park?.isInclusive || '',
    coverUrl:    park?.coverUrl    || null,
    coverFile:   null,
    photo2Url:   park?.photo2Url   || null,
    photo2File:  null,
    photo3Url:   park?.photo3Url   || null,
    photo3File:  null,
    games:       (park?.games     || []).map(g => ({ ...g, photoFile: null })),
    sports:      (park?.sports    || []).map(s => ({ ...s, photoFile: null })),
    mapPoints:   (park?.mapPoints || []).map(m => ({ ...m, photoFile: null })),
    sections:    (park?.sections  || []).map(s => ({ ...s, photoFiles: [] })),
  });

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  /* ── Game sub-form ── */
  const [gOpen, setGOpen] = useState(false);
  const [gEditIdx, setGEditIdx] = useState(null);
  const [gf, setGf] = useState({ emoji:'🎮', name:'', tag:'', shortDesc:'', fullDesc:'',
    color:'#0284C7', light:'#EFF6FF', photo:null, photoFile:null });

  const openNewGame = () => {
    setGf({ emoji:'🎮', name:'', tag:'', shortDesc:'', fullDesc:'', color:'#0284C7', light:'#EFF6FF', photo:null, photoFile:null });
    setGEditIdx(null);
    setGOpen(true);
  };

  const openEditGame = (idx) => {
    setGf(f.games[idx]);
    setGEditIdx(idx);
    setGOpen(true);
  };

  const addGame = () => {
    if (!gf.name.trim()) return;
    if (gEditIdx !== null) {
      const newGames = [...f.games];
      newGames[gEditIdx] = gf;
      set('games', newGames);
    } else {
      set('games', [...f.games, { ...gf, id: gf.id || ('g' + Date.now()) }]);
    }
    setGOpen(false);
  };

  /* ── Sport sub-form ── */
  const [spOpen, setSpOpen] = useState(false);
  const [spEditIdx, setSpEditIdx] = useState(null);
  const [spf, setSpf] = useState({ emoji:'💪', name:'', tag:'', shortDesc:'', fullDesc:'',
    color:'#ea580c', light:'#fff7ed', photo:null, photoFile:null });

  const openNewSport = () => {
    setSpf({ emoji:'💪', name:'', tag:'', shortDesc:'', fullDesc:'', color:'#ea580c', light:'#fff7ed', photo:null, photoFile:null });
    setSpEditIdx(null);
    setSpOpen(true);
  };

  const openEditSport = (idx) => {
    setSpf(f.sports[idx]);
    setSpEditIdx(idx);
    setSpOpen(true);
  };

  const addSport = () => {
    if (!spf.name.trim()) return;
    if (spEditIdx !== null) {
      const newSports = [...f.sports];
      newSports[spEditIdx] = spf;
      set('sports', newSports);
    } else {
      set('sports', [...f.sports, { ...spf, id: spf.id || ('sp' + Date.now()) }]);
    }
    setSpOpen(false);
  };

  /* ── Point sub-form ── */
  const [pOpen, setPOpen] = useState(false);
  const [pEditIdx, setPEditIdx] = useState(null);
  const [pf, setPf] = useState({ type:'games', emoji:'🎮', label:'', desc:'', lat:'', lng:'',
    color:'#0284C7', photo:null, photoFile:null });

  const openNewPoint = () => {
    setPf({ type:'games', emoji:'🎮', label:'', desc:'', lat:'', lng:'', color:'#0284C7', photo:null, photoFile:null });
    setPEditIdx(null);
    setPOpen(true);
  };

  const openEditPoint = (idx) => {
    setPf(f.mapPoints[idx]);
    setPEditIdx(idx);
    setPOpen(true);
  };

  const addPoint = () => {
    if (!pf.label.trim() || !pf.lat || !pf.lng) return;
    if (pEditIdx !== null) {
      const newPts = [...f.mapPoints];
      newPts[pEditIdx] = pf;
      set('mapPoints', newPts);
    } else {
      set('mapPoints', [...f.mapPoints, { ...pf, id: pf.id || ('mp' + Date.now()) }]);
    }
    setPOpen(false);
  };

  /* ── Section sub-form ── */
  const [sOpen, setSOpen] = useState(false);
  const [sEditIdx, setSEditIdx] = useState(null);
  const [sf, setSf] = useState({ title: '', content: '', photoUrls: [], photoFiles: [] });

  const openNewSection = () => {
    setSf({ title: '', content: '', photoUrls: [], photoFiles: [] });
    setSEditIdx(null);
    setSOpen(true);
  };

  const openEditSection = (idx) => {
    setSf({ ...f.sections[idx], photoFiles: [] });
    setSEditIdx(idx);
    setSOpen(true);
  };

  const addSection = () => {
    if (!sf.title.trim()) return;
    if (sEditIdx !== null) {
      const upd = [...f.sections];
      upd[sEditIdx] = sf;
      set('sections', upd);
    } else {
      set('sections', [...f.sections, { ...sf, id: 'sec_' + Date.now() }]);
    }
    setSOpen(false);
  };

  const handleSectionPhotoFiles = (files) => {
    const previews = files.map(f => f instanceof File ? URL.createObjectURL(f) : f);
    setSf(p => ({ ...p, photoFiles: files, photoUrls: previews }));
  };

  const removeExistingPhoto = (idx) => {
    setSf(p => ({
      ...p,
      photoUrls: p.photoUrls.filter((_, i) => i !== idx),
      photoFiles: p.photoFiles.filter((_, i) => i !== idx),
    }));
  };

  const submit = async () => {
    if (!f.name.trim() || !f.city.trim()) { alert('Nombre y ciudad son obligatorios.'); return; }
    setSaving(true);
    try {
      await onSave({
        ...f,
        lat:  parseFloat(f.lat)  || 40.4168,
        lng:  parseFloat(f.lng)  || -3.7038,
        tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.55)',
      backdropFilter:'blur(6px)', zIndex:500,
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'20px 16px', overflowY:'auto',
    }}>
      <div style={{
        background:'white', borderRadius:24, width:'100%', maxWidth:640,
        boxShadow:'0 32px 80px rgba(0,0,0,.3)',
        animation:'popUp .28s cubic-bezier(.34,1.4,.64,1)',
        marginTop: 20,
      }}>
        {/* Header */}
        <div style={{ padding:'22px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:800, color:'#0F172A' }}>
            {isEdit ? '✏️ Editar parque' : '➕ Nuevo parque'}
          </h3>
          <button onClick={onClose} style={{
            background:'#F1F5F9', border:'none', borderRadius:'50%',
            width:36, height:36, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}><X size={16} color="#64748B" /></button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1.5px solid #E2E8F0', margin:'16px 0 0', overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'11px 18px', border:'none', background:'none', cursor:'pointer',
              fontSize:13, fontWeight:700, whiteSpace:'nowrap',
              color: tab === t.id ? '#0284C7' : '#64748B',
              borderBottom: tab === t.id ? '2px solid #0284C7' : '2px solid transparent',
              marginBottom: -1.5,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:'22px 24px', maxHeight:'62vh', overflowY:'auto' }}>

          {/* ── DATOS BÁSICOS ── */}
          {tab === 'basic' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Nombre" required>
                  <input style={inputStyle} value={f.name} onChange={e => set('name', e.target.value)}
                    placeholder="Parque del Avión"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
                <Field label="Ciudad" required>
                  <input style={inputStyle} value={f.city} onChange={e => set('city', e.target.value)}
                    placeholder="Getafe, Madrid"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
              </div>
              <Field label="Dirección completa">
                <input style={inputStyle} value={f.address} onChange={e => set('address', e.target.value)}
                  placeholder="Av. Salvador Allende, 8"
                  onFocus={e => e.target.style.borderColor='#0284C7'}
                  onBlur={e => e.target.style.borderColor='#E2E8F0'} />
              </Field>
              <Field label="Descripción">
                <textarea style={{ ...inputStyle, resize:'vertical' }} rows={3}
                  value={f.description} onChange={e => set('description', e.target.value)}
                  placeholder="Descripción del parque y su propuesta de inclusión…"
                  onFocus={e => e.target.style.borderColor='#0284C7'}
                  onBlur={e => e.target.style.borderColor='#E2E8F0'} />
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Emoji del parque">
                  <input style={inputStyle} value={f.emoji} onChange={e => set('emoji', e.target.value)} placeholder="✈️"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
                <Field label="Badge / Etiqueta">
                  <input style={inputStyle} value={f.badge} onChange={e => set('badge', e.target.value)} placeholder="🥇 PARQUE ORO"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Latitud">
                  <input style={inputStyle} value={f.lat} onChange={e => set('lat', e.target.value)} placeholder="40.3084"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
                <Field label="Longitud">
                  <input style={inputStyle} value={f.lng} onChange={e => set('lng', e.target.value)} placeholder="-3.7139"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Color principal">
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:2 }}>
                    <input type="color" value={f.color} onChange={e => set('color', e.target.value)}
                      style={{ width:44, height:38, border:'1.5px solid #E2E8F0', borderRadius:8, cursor:'pointer', padding:2 }} />
                    <span style={{ fontSize:13, color:'#64748B' }}>{f.color}</span>
                  </div>
                </Field>
                <Field label="Color gradiente">
                  <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:2 }}>
                    <input type="color" value={f.color2} onChange={e => set('color2', e.target.value)}
                      style={{ width:44, height:38, border:'1.5px solid #E2E8F0', borderRadius:8, cursor:'pointer', padding:2 }} />
                    <span style={{ fontSize:13, color:'#64748B' }}>{f.color2}</span>
                  </div>
                </Field>
              </div>
              {/* Preview */}
              <div style={{ height:44, borderRadius:10, background:`linear-gradient(135deg,${f.color},${f.color2})`,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'white', fontWeight:800, fontSize:15,
                  textShadow:'0 1px 4px rgba(0,0,0,.25)' }}>{f.emoji} {f.name || 'Nombre del parque'}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Horario">
                  <input style={inputStyle} value={f.schedule} onChange={e => set('schedule', e.target.value)}
                    placeholder="L-D: 09:00 - 22:00"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
                <Field label="Video YouTube (URL)">
                  <input style={inputStyle} value={f.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
              </div>
              <Field label="Etiquetas de accesibilidad (separadas por coma)">
                <textarea style={{ ...inputStyle, resize:'none' }} rows={2}
                  value={f.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="♿ Sillas de ruedas, 🅿️ Parking PMR, 🌿 Suelo caucho…"
                  onFocus={e => e.target.style.borderColor='#0284C7'}
                  onBlur={e => e.target.style.borderColor='#E2E8F0'} />
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Accesibilidad / Inclusivo">
                  <input style={inputStyle} value={f.isInclusive} onChange={e => set('isInclusive', e.target.value)}
                    placeholder="100% inclusivo, 50% inclusivo…"
                    onFocus={e => e.target.style.borderColor='#0284C7'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                </Field>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
                  fontSize:14, fontWeight:600, color:'#475569', userSelect:'none' }}>
                  <input type="checkbox" checked={f.active} onChange={e => set('active', e.target.checked)}
                    style={{ width:17, height:17, cursor:'pointer', accentColor:'#0284C7' }} />
                  Visible al público
                </label>
              </div>
            </div>
          )}

          {/* ── FOTOS ── */}
          {tab === 'cover' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <p style={{ fontSize:13, color:'#64748B', background:'#F0F9FF', borderRadius:10,
                padding:'10px 14px', lineHeight:1.6 }}>
                📸 La portada aparece en las tarjetas y fondo del encabezado. Las fotos adicionales complementan el parque.
              </p>
              <ImageUploader
                label="Foto de portada principal"
                hint="Mínimo 800×450 px — se muestra en horizontal"
                currentUrl={f.coverUrl}
                aspect="16/9"
                onFile={file => { set('coverFile', file); if (!file) set('coverUrl', null); }}
              />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <ImageUploader
                  label="Foto adicional 2"
                  hint="Opcional. Aspecto 16:9"
                  currentUrl={f.photo2Url}
                  aspect="16/9"
                  onFile={file => { set('photo2File', file); if (!file) set('photo2Url', null); }}
                />
                <ImageUploader
                  label="Foto adicional 3"
                  hint="Opcional. Aspecto 16:9"
                  currentUrl={f.photo3Url}
                  aspect="16/9"
                  onFile={file => { set('photo3File', file); if (!file) set('photo3Url', null); }}
                />
              </div>
            </div>
          )}

          {/* ── JUEGOS ── */}
          {tab === 'games' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#64748B' }}>{f.games.length} juego(s)</span>
                <button onClick={openNewGame} style={{
                  background:'linear-gradient(135deg,#0284C7,#38BDF8)', color:'white',
                  border:'none', borderRadius:10, padding:'8px 16px',
                  fontSize:13, fontWeight:700, cursor:'pointer',
                }}>+ Añadir juego</button>
              </div>

              {gOpen && (
                <div style={{ background:'#F8FAFC', borderRadius:14, padding:18,
                  border:'1.5px solid #E2E8F0', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif' }}>
                    {gEditIdx !== null ? 'Editar juego' : 'Nuevo juego'}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:10 }}>
                    <Field label="Emoji">
                      <input style={inputStyle} value={gf.emoji} onChange={e => setGf(p => ({...p, emoji:e.target.value}))}
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                    <Field label="Nombre" required>
                      <input style={inputStyle} value={gf.name} onChange={e => setGf(p => ({...p, name:e.target.value}))} placeholder="Tobogán accesible"
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                  </div>
                  <Field label="Categoría (tag)">
                    <input style={inputStyle} value={gf.tag} onChange={e => setGf(p => ({...p, tag:e.target.value}))} placeholder="Deslizamiento, Balanceo, Inclusivo…"
                      onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <Field label="Descripción corta (tarjeta)">
                    <input style={inputStyle} value={gf.shortDesc} onChange={e => setGf(p => ({...p, shortDesc:e.target.value}))} placeholder="Breve descripción para la tarjeta"
                      onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <Field label="Descripción completa (modal)">
                    <textarea style={{ ...inputStyle, resize:'none' }} rows={3}
                      value={gf.fullDesc} onChange={e => setGf(p => ({...p, fullDesc:e.target.value}))} placeholder="Explicación detallada del juego…"
                      onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Color</label>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input type="color" value={gf.color} onChange={e => setGf(p=>({...p,color:e.target.value}))}
                          style={{ width:40,height:34,border:'1.5px solid #E2E8F0',borderRadius:8,cursor:'pointer',padding:2 }}/>
                        <span style={{ fontSize:12, color:'#64748B' }}>{gf.color}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Fondo claro</label>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input type="color" value={gf.light} onChange={e => setGf(p=>({...p,light:e.target.value}))}
                          style={{ width:40,height:34,border:'1.5px solid #E2E8F0',borderRadius:8,cursor:'pointer',padding:2 }}/>
                        <span style={{ fontSize:12, color:'#64748B' }}>{gf.light}</span>
                      </div>
                    </div>
                  </div>
                  <ImageUploader label="Foto del juego" hint="Aparece en la tarjeta y en el modal"
                    currentUrl={gf.photo} aspect="4/3"
                    onFile={file => setGf(p => ({...p, photoFile:file, photo:file?URL.createObjectURL(file):null}))}/>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={addGame} style={{
                      flex:1, background:'linear-gradient(135deg,#0284C7,#38BDF8)', color:'white',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>✓ {gEditIdx !== null ? 'Guardar' : 'Añadir'}</button>
                    <button onClick={() => setGOpen(false)} style={{
                      flex:1, background:'#F1F5F9', color:'#475569',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>Cancelar</button>
                  </div>
                </div>
              )}

              {f.games.map((g, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', background:'white',
                  border:'1.5px solid #F1F5F9', borderRadius:12, overflow:'hidden' }}>
                  <div style={{ width:60, height:60, flexShrink:0, background:g.light||'#EFF6FF',
                    display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {g.photo ? <img src={g.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:28 }}>{g.emoji}</span>}
                  </div>
                  <div style={{ flex:1, padding:'10px 14px' }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{g.name}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{g.tag} · {g.shortDesc?.slice(0,50)}</div>
                  </div>
                  <div style={{ display:'flex' }}>
                    <button onClick={() => openEditGame(i)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 10px', color:'#0284C7', fontSize:16 }} title="Editar">✏️</button>
                    <button onClick={() => set('games', f.games.filter((_, j) => j !== i))}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 16px 0 6px', color:'#DC2626', fontSize:20 }} title="Eliminar">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DEPORTES ── */}
          {tab === 'sports' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#64748B' }}>{f.sports.length} elemento(s)</span>
                <button onClick={openNewSport} style={{
                  background:'linear-gradient(135deg,#ea580c,#f97316)', color:'white',
                  border:'none', borderRadius:10, padding:'8px 16px',
                  fontSize:13, fontWeight:700, cursor:'pointer',
                }}>+ Añadir elemento</button>
              </div>

              {spOpen && (
                <div style={{ background:'#F8FAFC', borderRadius:14, padding:18,
                  border:'1.5px solid #E2E8F0', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif' }}>
                    {spEditIdx !== null ? 'Editar elemento' : 'Nuevo elemento'}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:10 }}>
                    <Field label="Emoji">
                      <input style={inputStyle} value={spf.emoji} onChange={e => setSpf(p => ({...p, emoji:e.target.value}))}
                        onFocus={e=>e.target.style.borderColor='#ea580c'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                    <Field label="Nombre" required>
                      <input style={inputStyle} value={spf.name} onChange={e => setSpf(p => ({...p, name:e.target.value}))} placeholder="Máquina de remo"
                        onFocus={e=>e.target.style.borderColor='#ea580c'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                  </div>
                  <Field label="Categoría (tag)">
                    <input style={inputStyle} value={spf.tag} onChange={e => setSpf(p => ({...p, tag:e.target.value}))} placeholder="Cardio, Fuerza, Inclusivo…"
                      onFocus={e=>e.target.style.borderColor='#ea580c'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <Field label="Descripción corta (tarjeta)">
                    <input style={inputStyle} value={spf.shortDesc} onChange={e => setSpf(p => ({...p, shortDesc:e.target.value}))} placeholder="Breve descripción para la tarjeta"
                      onFocus={e=>e.target.style.borderColor='#ea580c'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <Field label="Descripción completa (modal)">
                    <textarea style={{ ...inputStyle, resize:'none' }} rows={3}
                      value={spf.fullDesc} onChange={e => setSpf(p => ({...p, fullDesc:e.target.value}))} placeholder="Explicación detallada del elemento…"
                      onFocus={e=>e.target.style.borderColor='#ea580c'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Color</label>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input type="color" value={spf.color} onChange={e => setSpf(p=>({...p,color:e.target.value}))}
                          style={{ width:40,height:34,border:'1.5px solid #E2E8F0',borderRadius:8,cursor:'pointer',padding:2 }}/>
                        <span style={{ fontSize:12, color:'#64748B' }}>{spf.color}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Fondo claro</label>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input type="color" value={spf.light} onChange={e => setSpf(p=>({...p,light:e.target.value}))}
                          style={{ width:40,height:34,border:'1.5px solid #E2E8F0',borderRadius:8,cursor:'pointer',padding:2 }}/>
                        <span style={{ fontSize:12, color:'#64748B' }}>{spf.light}</span>
                      </div>
                    </div>
                  </div>
                  <ImageUploader label="Foto del elemento" hint="Aparece en la tarjeta y en el modal"
                    currentUrl={spf.photo} aspect="4/3"
                    onFile={file => setSpf(p => ({...p, photoFile:file, photo:file?URL.createObjectURL(file):null}))}/>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={addSport} style={{
                      flex:1, background:'linear-gradient(135deg,#ea580c,#f97316)', color:'white',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>✓ {spEditIdx !== null ? 'Guardar' : 'Añadir'}</button>
                    <button onClick={() => setSpOpen(false)} style={{
                      flex:1, background:'#F1F5F9', color:'#475569',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>Cancelar</button>
                  </div>
                </div>
              )}

              {f.sports.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', background:'white',
                  border:'1.5px solid #F1F5F9', borderRadius:12, overflow:'hidden' }}>
                  <div style={{ width:60, height:60, flexShrink:0, background:s.light||'#fff7ed',
                    display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {s.photo ? <img src={s.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:28 }}>{s.emoji}</span>}
                  </div>
                  <div style={{ flex:1, padding:'10px 14px' }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{s.tag} · {s.shortDesc?.slice(0,50)}</div>
                  </div>
                  <div style={{ display:'flex' }}>
                    <button onClick={() => openEditSport(i)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 10px', color:'#ea580c', fontSize:16 }} title="Editar">✏️</button>
                    <button onClick={() => set('sports', f.sports.filter((_, j) => j !== i))}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 16px 0 6px', color:'#DC2626', fontSize:20 }} title="Eliminar">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PUNTOS DEL MAPA ── */}
          {tab === 'points' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <p style={{ fontSize:13, color:'#0369A1', background:'#F0F9FF',
                borderRadius:10, padding:'10px 14px', lineHeight:1.6 }}>
                📍 Añade marcadores del parque: entradas, parking, zonas de juego y descanso.
              </p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#64748B' }}>{f.mapPoints.length} punto(s)</span>
                <button onClick={openNewPoint} style={{
                  background:'linear-gradient(135deg,#16A34A,#22C55E)', color:'white',
                  border:'none', borderRadius:10, padding:'8px 16px',
                  fontSize:13, fontWeight:700, cursor:'pointer',
                }}>+ Añadir punto</button>
              </div>

              {pOpen && (
                <div style={{ background:'#F8FAFC', borderRadius:14, padding:18,
                  border:'1.5px solid #E2E8F0', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif' }}>
                    {pEditIdx !== null ? 'Editar punto' : 'Nuevo punto'}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', marginBottom:6, letterSpacing:'.6px', textTransform:'uppercase' }}>Tipo</label>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {PT_OPTS.map(o => (
                        <button key={o.v} onClick={() => setPf(p => ({ ...p, type:o.v, color:PT_COLORS[o.v] }))}
                          style={{
                            padding:'7px 14px', border:`1.5px solid ${pf.type===o.v?PT_COLORS[o.v]:'#E2E8F0'}`,
                            borderRadius:20, background:pf.type===o.v?PT_COLORS[o.v]+'15':'white',
                            fontSize:12, fontWeight:700, cursor:'pointer',
                            color:pf.type===o.v?PT_COLORS[o.v]:'#64748B',
                          }}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:10 }}>
                    <Field label="Emoji">
                      <input style={inputStyle} value={pf.emoji} onChange={e => setPf(p=>({...p,emoji:e.target.value}))}
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                    <Field label="Nombre del punto" required>
                      <input style={inputStyle} value={pf.label} onChange={e => setPf(p=>({...p,label:e.target.value}))} placeholder="Parking PMR Norte"
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                  </div>
                  <Field label="Descripción">
                    <input style={inputStyle} value={pf.desc} onChange={e => setPf(p=>({...p,desc:e.target.value}))} placeholder="Descripción del punto…"
                      onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                  </Field>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <Field label="Latitud" required>
                      <input style={inputStyle} value={pf.lat} onChange={e => setPf(p=>({...p,lat:e.target.value}))} placeholder="40.3092"
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                    <Field label="Longitud" required>
                      <input style={inputStyle} value={pf.lng} onChange={e => setPf(p=>({...p,lng:e.target.value}))} placeholder="-3.7139"
                        onFocus={e=>e.target.style.borderColor='#0284C7'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}/>
                    </Field>
                  </div>
                  <ImageUploader label="Foto del punto (opcional)" hint="Aparece en el popup del mapa al hacer clic"
                    currentUrl={pf.photo} aspect="16/9"
                    onFile={file => setPf(p=>({...p,photoFile:file,photo:file?URL.createObjectURL(file):null}))}/>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={addPoint} style={{
                      flex:1, background:'linear-gradient(135deg,#16A34A,#22C55E)', color:'white',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>✓ {pEditIdx !== null ? 'Guardar' : 'Añadir'}</button>
                    <button onClick={() => setPOpen(false)} style={{
                      flex:1, background:'#F1F5F9', color:'#475569',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>Cancelar</button>
                  </div>
                </div>
              )}

              {f.mapPoints.map((pt, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', background:'white',
                  border:`1.5px solid ${PT_COLORS[pt.type]||'#E2E8F0'}22`, borderRadius:12, overflow:'hidden' }}>
                  <div style={{ width:60, height:60, flexShrink:0,
                    background:(PT_COLORS[pt.type]||'#0284C7')+'14',
                    display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {pt.photo ? <img src={pt.photo} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : <span style={{ fontSize:26 }}>{pt.emoji}</span>}
                  </div>
                  <div style={{ flex:1, padding:'10px 14px' }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{pt.label}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{pt.type} · {pt.lat}, {pt.lng}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <button onClick={() => openEditPoint(i)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 10px', color:'#16A34A', fontSize:16 }} title="Editar">✏️</button>
                    <button onClick={() => set('mapPoints', f.mapPoints.filter((_, j) => j !== i))}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 16px 0 6px', color:'#DC2626', fontSize:20 }} title="Eliminar">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* ── SECCIONES ── */}
          {tab === 'sections' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <p style={{ fontSize:13, color:'#64748B', background:'#F0F9FF',
                borderRadius:10, padding:'10px 14px', lineHeight:1.6 }}>
                📖 Crea secciones de contenido ("Cómo llegar", "Accesibilidad"...) con texto y fotos. Aparecen en la página del parque entre la información principal y las reseñas.
              </p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#64748B' }}>{f.sections.length} sección(es)</span>
                <button onClick={openNewSection} style={{
                  background:'linear-gradient(135deg,#7C3AED,#A855F7)', color:'white',
                  border:'none', borderRadius:10, padding:'8px 16px',
                  fontSize:13, fontWeight:700, cursor:'pointer',
                }}>+ Añadir sección</button>
              </div>

              {sOpen && (
                <div style={{ background:'#F8FAFC', borderRadius:14, padding:18,
                  border:'1.5px solid #E2E8F0', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ fontSize:15, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#7C3AED' }}>
                    {sEditIdx !== null ? '✏️ Editar sección' : '➕ Nueva sección'}
                  </div>
                  <Field label="Título de la sección" required>
                    <input style={inputStyle} value={sf.title}
                      onChange={e => setSf(p => ({ ...p, title: e.target.value }))}
                      placeholder="¿Cómo llegar? / Accesibilidad / Zonas de juego…"
                      onFocus={e => e.target.style.borderColor='#7C3AED'}
                      onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                  </Field>
                  <Field label="Texto de la sección (párrafos separados por saltos de línea)">
                    <textarea style={{ ...inputStyle, resize:'vertical' }} rows={5}
                      value={sf.content}
                      onChange={e => setSf(p => ({ ...p, content: e.target.value }))}
                      placeholder="El parque cuenta con acceso desde...

También dispone de plazas reservadas..."
                      onFocus={e => e.target.style.borderColor='#7C3AED'}
                      onBlur={e => e.target.style.borderColor='#E2E8F0'} />
                  </Field>

                  {/* Fotos actuales */}
                  {sf.photoUrls.length > 0 && (
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B',
                        marginBottom:6, letterSpacing:'.6px', textTransform:'uppercase' }}>Fotos actuales</label>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                        {sf.photoUrls.map((url, i) => (
                          <div key={i} style={{ position:'relative', width:80, height:60, borderRadius:8, overflow:'hidden' }}>
                            <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            <button onClick={() => removeExistingPhoto(i)} style={{
                              position:'absolute', top:2, right:2,
                              background:'rgba(220,38,38,.85)', border:'none', borderRadius:'50%',
                              width:18, height:18, cursor:'pointer', color:'white',
                              fontSize:11, display:'flex', alignItems:'center', justifyContent:'center',
                            }}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Añadir fotos nuevas */}
                  <Field label={`Añadir fotos (hasta ${6 - sf.photoUrls.length} más)`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => {
                        const files = Array.from(e.target.files).slice(0, 6 - sf.photoUrls.length);
                        const newUrls = files.map(f => URL.createObjectURL(f));
                        setSf(p => ({
                          ...p,
                          photoUrls: [...p.photoUrls, ...newUrls],
                          photoFiles: [...p.photoFiles, ...files],
                        }));
                        e.target.value = '';
                      }}
                      style={{ fontSize:13, color:'#475569', padding:'8px 0' }}
                    />
                  </Field>

                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={addSection} style={{
                      flex:1, background:'linear-gradient(135deg,#7C3AED,#A855F7)', color:'white',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>✓ {sEditIdx !== null ? 'Guardar' : 'Añadir'}</button>
                    <button onClick={() => setSOpen(false)} style={{
                      flex:1, background:'#F1F5F9', color:'#475569',
                      border:'none', borderRadius:10, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer',
                    }}>Cancelar</button>
                  </div>
                </div>
              )}

              {f.sections.map((sec, i) => (
                <div key={sec.id || i} style={{
                  display:'flex', alignItems:'center', gap:12, background:'white',
                  border:'1.5px solid #F1F5F9', borderRadius:12, padding:'12px 14px',
                }}>
                  {/* Photo thumb */}
                  <div style={{
                    width:56, height:56, borderRadius:10, flexShrink:0, overflow:'hidden',
                    background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {sec.photoUrls?.[0]
                      ? <img src={sec.photoUrls[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontSize:24 }}>📔</span>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{sec.title || 'Sin título'}</div>
                    <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>
                      {sec.photoUrls?.length || 0} foto(s) · {sec.content?.length > 60 ? sec.content.slice(0,60) + '…' : (sec.content || 'Sin texto')}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                    <button onClick={() => set('sections', f.sections.map((s,j) => j===i-1 ? f.sections[i] : j===i ? f.sections[i-1] : s))}
                      disabled={i === 0}
                      style={{ background:'none', border:'none', cursor: i===0?'default':'pointer', padding:'4px 6px', color:'#94A3B8', fontSize:16, opacity: i===0?0.3:1 }}
                      title="Subir">↑</button>
                    <button onClick={() => set('sections', f.sections.map((s,j) => j===i+1 ? f.sections[i] : j===i ? f.sections[i+1] : s))}
                      disabled={i === f.sections.length-1}
                      style={{ background:'none', border:'none', cursor: i===f.sections.length-1?'default':'pointer', padding:'4px 6px', color:'#94A3B8', fontSize:16, opacity: i===f.sections.length-1?0.3:1 }}
                      title="Bajar">↓</button>
                    <button onClick={() => openEditSection(i)}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 8px', color:'#7C3AED', fontSize:16 }} title="Editar">✏️</button>
                    <button onClick={() => set('sections', f.sections.filter((_,j) => j !== i))}
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 8px', color:'#DC2626', fontSize:20 }} title="Eliminar">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px 22px', borderTop:'1px solid #F1F5F9', display:'flex', gap:10 }}>
          <button onClick={submit} disabled={saving} style={{
            flex:1, padding:'13px',
            background: saving ? '#94A3B8' : 'linear-gradient(135deg,#0284C7,#38BDF8)',
            color:'white', border:'none', borderRadius:12,
            fontSize:15, fontWeight:700, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily:'Plus Jakarta Sans,sans-serif', transition:'opacity .2s',
          }}>
            {saving ? '⏳ Guardando…' : `✓ ${isEdit ? 'Guardar cambios' : 'Crear parque'}`}
          </button>
          <button onClick={onClose} disabled={saving} style={{
            padding:'13px 20px', background:'#F1F5F9', color:'#475569',
            border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer',
          }}>Cancelar</button>
        </div>
      </div>
      <style>{`@keyframes popUp{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
