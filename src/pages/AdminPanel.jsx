import React, { useState } from 'react';
import { LogOut, RefreshCw, Plus, Edit2, Trash2, PauseCircle, PlayCircle, MapPin } from 'lucide-react';
import { signOut, createPark, updatePark, toggleActive, deletePark } from '../lib/supabase';
import ParkModal from '../admin/ParkModal';

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:999,
      background: type === 'error' ? '#DC2626' : '#0F172A',
      color:'white', padding:'12px 20px', borderRadius:14,
      fontSize:13, fontWeight:700, boxShadow:'0 8px 24px rgba(0,0,0,.25)',
      animation:'toastIn .25s ease',
    }}>
      {type === 'error' ? '❌' : '✅'} {msg}
    </div>
  );
}

export default function AdminPanel({ parks, loading, onRefresh, onLogout }) {
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [toast,   setToast]   = useState({ msg:'', type:'success' });

  const notify = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  const handleLogout = async () => { await signOut(); onLogout(); };

  const doCreate = async data => {
    try { await createPark(data); onRefresh(); setAdding(false); notify('Parque creado 🎉'); }
    catch (e) { notify(e.message || 'Error al crear', 'error'); }
  };

  const doUpdate = async data => {
    try { await updatePark(editing.id, data); onRefresh(); setEditing(null); notify('Cambios guardados ✓'); }
    catch (e) { notify(e.message || 'Error al guardar', 'error'); }
  };

  const doToggle = async p => {
    try { await toggleActive(p.id, !p.active); onRefresh(); notify(p.active ? 'Parque pausado' : 'Parque activado'); }
    catch { notify('Error', 'error'); }
  };

  const doDelete = async p => {
    if (!window.confirm(`¿Eliminar "${p.name}" permanentemente? Esta acción no se puede deshacer.`)) return;
    try { await deletePark(p.id); onRefresh(); notify('Parque eliminado'); }
    catch { notify('Error al eliminar', 'error'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9' }}>
      <Toast msg={toast.msg} type={toast.type} />
      {adding  && <ParkModal mode="add"  onSave={doCreate} onClose={() => setAdding(false)} />}
      {editing && <ParkModal mode="edit" park={editing} onSave={doUpdate} onClose={() => setEditing(null)} />}

      {/* Nav */}
      <nav style={{
        background:'linear-gradient(135deg,#0F172A,#1E293B)',
        boxShadow:'0 2px 20px rgba(0,0,0,.3)',
        position:'sticky', top:0, zIndex:30,
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px',
          height:64, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:'linear-gradient(135deg,#0284C7,#38BDF8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 10px rgba(2,132,199,.4)', fontSize:16 }}>🌳</div>
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:'#38BDF8',
                letterSpacing:'.8px', textTransform:'uppercase' }}>Panel Admin</div>
              <div style={{ fontSize:14, fontWeight:800, color:'white',
                fontFamily:'Syne,sans-serif' }}>Parques Inclusivos</div>
            </div>
          </div>

          <div style={{ flex:1 }} />

          <button onClick={onRefresh} style={{
            background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)',
            borderRadius:8, width:36, height:36, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <RefreshCw size={15} color="#94A3B8" />
          </button>
          <button onClick={handleLogout} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)',
            borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700,
            cursor:'pointer', color:'#94A3B8', fontFamily:'Plus Jakarta Sans,sans-serif',
          }}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 32px 60px' }}>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}
          className="stats-grid">
          {[
            { e:'🏞️', v:parks.length,                               l:'Total parques',  bg:'#EFF6FF', color:'#0284C7' },
            { e:'✅', v:parks.filter(p=>p.active).length,            l:'Activos',        bg:'#F0FDF4', color:'#16A34A' },
            { e:'⏸️', v:parks.filter(p=>!p.active).length,           l:'Pausados',       bg:'#FFFBEB', color:'#D97706' },
            { e:'🎢', v:parks.reduce((s,p)=>s+(p.games?.length||0),0), l:'Total juegos', bg:'#F5F3FF', color:'#7C3AED' },
          ].map(s => (
            <div key={s.l} style={{ background:s.bg, borderRadius:16, padding:'18px 20px',
              boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{s.e}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:900, color:s.color }}>{s.v}</div>
              <div style={{ fontSize:12, color:'#64748B', fontWeight:600, marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:800, color:'#0F172A' }}>
            Gestión de Parques
          </h2>
          <button onClick={() => setAdding(true)} style={{
            display:'flex', alignItems:'center', gap:8,
            background:'linear-gradient(135deg,#0284C7,#38BDF8)',
            color:'white', border:'none', borderRadius:12,
            padding:'11px 22px', fontSize:14, fontWeight:700, cursor:'pointer',
            fontFamily:'Plus Jakarta Sans,sans-serif',
            boxShadow:'0 6px 18px rgba(2,132,199,.3)', transition:'transform .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform=''}>
            <Plus size={16} /> Añadir parque
          </button>
        </div>

        {/* Parks list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#94A3B8', fontSize:15 }}>
            ⏳ Cargando…
          </div>
        ) : parks.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🏗️</div>
            <p style={{ fontSize:16, color:'#94A3B8', marginBottom:20 }}>No hay parques todavía</p>
            <button onClick={() => setAdding(true)} style={{
              background:'linear-gradient(135deg,#0284C7,#38BDF8)', color:'white',
              border:'none', borderRadius:12, padding:'13px 28px',
              fontSize:15, fontWeight:700, cursor:'pointer',
            }}>+ Crear el primero</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {parks.map(park => (
              <div key={park.id} style={{
                background:'white', borderRadius:18, overflow:'hidden',
                border:'1.5px solid #E2E8F0',
                boxShadow:'0 2px 10px rgba(0,0,0,.05)',
                display:'flex',
              }}>
                {/* Cover thumb */}
                <div style={{
                  width:110, flexShrink:0,
                  background: `linear-gradient(140deg,${park.color},${park.color2})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  overflow:'hidden',
                }}>
                  {park.coverUrl
                    ? <img src={park.coverUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:40 }}>{park.emoji}</span>
                  }
                </div>

                {/* Content */}
                <div style={{ flex:1, padding:'16px 20px', display:'flex', alignItems:'center',
                  gap:16, flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:5 }}>
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:17,
                        color:'#0F172A' }}>{park.name}</span>
                      <span style={{
                        background: park.active ? '#F0FDF4' : '#F1F5F9',
                        color: park.active ? '#16A34A' : '#94A3B8',
                        border: `1px solid ${park.active ? '#BBF7D0' : '#E2E8F0'}`,
                        borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700,
                      }}>
                        {park.active ? '✅ Activo' : '⏸️ Pausado'}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5,
                      fontSize:13, color:'#64748B', marginBottom:6 }}>
                      <MapPin size={12} /> {park.city}
                    </div>
                    <div style={{ fontSize:12, color:'#94A3B8' }}>
                      🎮 {park.games?.length || 0} juegos
                      &nbsp;·&nbsp; 📍 {park.mapPoints?.length || 0} puntos
                      &nbsp;·&nbsp; ⭐ {park.rating}
                      &nbsp;·&nbsp; 💬 {park.reviewCount} reseñas
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <button onClick={() => setEditing(park)} style={{
                      display:'flex', alignItems:'center', gap:6,
                      background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10,
                      padding:'8px 14px', fontSize:13, fontWeight:700, cursor:'pointer', color:'#475569',
                      transition:'all .2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background='#F1F5F9'}
                      onMouseLeave={e => e.currentTarget.style.background='#F8FAFC'}>
                      <Edit2 size={13} /> Editar
                    </button>
                    <button onClick={() => doToggle(park)} style={{
                      display:'flex', alignItems:'center', gap:6,
                      background: park.active ? '#FFFBEB' : '#F0FDF4',
                      border: `1px solid ${park.active ? '#FDE68A' : '#BBF7D0'}`,
                      borderRadius:10, padding:'8px 14px', fontSize:13, fontWeight:700,
                      cursor:'pointer', color: park.active ? '#D97706' : '#16A34A',
                    }}>
                      {park.active ? <PauseCircle size={13} /> : <PlayCircle size={13} />}
                      {park.active ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => doDelete(park)} style={{
                      display:'flex', alignItems:'center', gap:6,
                      background:'#FEF2F2', border:'1px solid #FECACA',
                      borderRadius:10, padding:'8px 12px', fontSize:13, fontWeight:700,
                      cursor:'pointer', color:'#DC2626',
                    }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes toastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
        @media(max-width:900px){
          .stats-grid{grid-template-columns:repeat(2,1fr) !important}
          nav div{padding:0 20px !important}
        }
        @media(max-width:600px){
          .stats-grid{grid-template-columns:1fr 1fr !important}
        }
      `}</style>
    </div>
  );
}
