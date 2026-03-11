import React, { useState, useEffect, useCallback } from 'react';
import { supabase, fetchParks, getSession } from './lib/supabase';

import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import ParkHero      from './components/ParkHero';
import ParkInfo      from './components/ParkInfo';
import Games         from './components/Games';
import MapSection    from './components/MapSection';
import Accessibility from './components/Accessibility';
import Reviews       from './components/Reviews';
import Footer        from './components/Footer';
import AdminLogin    from './pages/AdminLogin';
import AdminPanel    from './pages/AdminPanel';

export default function App() {
  const [parks,    setParks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [session,  setSession]  = useState(null);
  const [view,     setView]     = useState('home');   // 'home' | 'park' | 'login' | 'admin'
  const [selPark,  setSelPark]  = useState(null);

  /* ── Auth listener ── */
  useEffect(() => {
    getSession().then(s => {
      setSession(s);
      if (s) setView('admin');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (!s && view === 'admin') goHome();
    });
    return () => subscription.unsubscribe();
  }, []);                                   // eslint-disable-line

  /* ── Data loader ── */
  const load = useCallback(async (admin = false) => {
    setLoading(true);
    try { setParks(await fetchParks({ admin })); }
    catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(view === 'admin'); }, [view, load]);

  /* ── Scroll to top on view change ── */
  useEffect(() => { window.scrollTo(0, 0); }, [view, selPark?.id]);

  /* ── Navigation helpers ── */
  const goHome      = () => { setView('home');  setSelPark(null); };
  const goPark      = p  => { setSelPark(p);    setView('park');  };
  const goLogin     = () => setView('login');
  const goAdmin     = () => setView('admin');
  const onLogout    = () => { setSession(null); goHome(); };
  const onRefresh   = () => load(view === 'admin');
  const onReviewAdded = async () => {
    const updated = await fetchParks({ admin: false });
    const fresh = updated.find(p => p.id === selPark?.id);
    if (fresh) setSelPark(fresh);
    setParks(updated);
  };

  /* ── Admin route ── */
  if (view === 'login') {
    return <AdminLogin onLogin={goAdmin} onBack={goHome} />;
  }
  if (view === 'admin' && session) {
    return <AdminPanel parks={parks} loading={loading} onRefresh={onRefresh} onLogout={onLogout} />;
  }

  /* ── Park detail ── */
  if (view === 'park' && selPark) {
    return (
      <div>
        <Navbar park={selPark} onHome={goHome} onAdmin={session ? goAdmin : goLogin} />
        <ParkHero park={selPark} />
        <ParkInfo park={selPark} />
        <Games    park={selPark} />
        <MapSection park={selPark} />
        <Accessibility park={selPark} />
        <Reviews   park={selPark} onReviewAdded={onReviewAdded} />
        <Footer    park={selPark} onHome={goHome} />
      </div>
    );
  }

  /* ── Home ── */
  return (
    <div>
      <Navbar park={null} onHome={goHome} onAdmin={session ? goAdmin : goLogin} />
      {loading ? (
        <div style={{
          minHeight:'100vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:16,
          background:'linear-gradient(150deg,#F0F9FF,#E0F2FE)',
        }}>
          <div style={{ width:40, height:40, border:'3px solid #BAE6FD',
            borderTopColor:'#0284C7', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          <span style={{ color:'#64748B', fontSize:15, fontWeight:600 }}>Cargando parques…</span>
        </div>
      ) : (
        <>
          <Hero parks={parks} onParkClick={goPark} />
        </>
      )}
    </div>
  );
}
