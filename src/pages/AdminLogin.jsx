import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { signIn } from '../lib/supabase';

export default function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [show,  setShow]  = useState(false);
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);

  const login = async () => {
    if (!email || !pass) { setErr('Rellena email y contraseña.'); return; }
    setBusy(true); setErr('');
    const { error } = await signIn(email, pass);
    if (error) { setErr('Credenciales incorrectas.'); setBusy(false); return; }
    onLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg,#0F172A 0%,#0284C7 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      {/* Dot grid */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none',
        backgroundImage:'radial-gradient(rgba(255,255,255,.08) 1.5px,transparent 1.5px)',
        backgroundSize:'32px 32px' }}/>

      <div style={{
        background: 'white', borderRadius: 24, padding: '44px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 40px 80px rgba(0,0,0,.4)',
        position: 'relative', zIndex: 1,
        animation: 'popUp .35s cubic-bezier(.34,1.4,.64,1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#0284C7,#38BDF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(2,132,199,.35)',
          }}>
            <ShieldCheck size={28} color="white" strokeWidth={2} />
          </div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800,
            color: '#0F172A', marginBottom: 6 }}>Panel Admin</h2>
          <p style={{ fontSize: 14, color: '#64748B' }}>Parques Infantiles Inclusivos</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B',
              marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              style={{
                width:'100%', padding:'11px 14px', border:'1.5px solid #E2E8F0',
                borderRadius:10, fontSize:14, outline:'none', fontFamily:'Plus Jakarta Sans,sans-serif',
                transition:'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor='#0284C7'}
              onBlur={e => e.target.style.borderColor='#E2E8F0'}
              onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B',
              marginBottom:5, letterSpacing:'.6px', textTransform:'uppercase' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                style={{
                  width:'100%', padding:'11px 44px 11px 14px', border:'1.5px solid #E2E8F0',
                  borderRadius:10, fontSize:14, outline:'none', fontFamily:'Plus Jakarta Sans,sans-serif',
                  transition:'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor='#0284C7'}
                onBlur={e => e.target.style.borderColor='#E2E8F0'}
                onKeyDown={e => e.key === 'Enter' && login()} />
              <button onClick={() => setShow(v => !v)} style={{
                position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:'#94A3B8',
              }}>
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {err && (
            <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA',
              borderRadius:10, padding:'10px 14px', fontSize:13, color:'#DC2626' }}>
              ⚠️ {err}
            </div>
          )}

          <button onClick={login} disabled={busy} style={{
            width: '100%', padding: '14px',
            background: busy ? '#94A3B8' : 'linear-gradient(135deg,#0284C7,#38BDF8)',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
            boxShadow: busy ? 'none' : '0 8px 24px rgba(2,132,199,.35)',
            transition: 'all .2s',
          }}>
            {busy ? '⏳ Entrando…' : 'Iniciar sesión →'}
          </button>
          <button onClick={onBack} style={{
            width: '100%', padding: '12px',
            background: 'none', color: '#64748B',
            border: '1.5px solid #E2E8F0', borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
          }}>← Volver al sitio público</button>
        </div>
      </div>
      <style>{`@keyframes popUp{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
