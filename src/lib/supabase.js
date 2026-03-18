import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

/* ─── AUTH ──────────────────────────────────────────────────── */
export const signIn  = (email, pass) =>
  supabase.auth.signInWithPassword({ email, password: pass });
export const signOut = () => supabase.auth.signOut();
export const getSession = () =>
  supabase.auth.getSession().then(r => r.data.session);

/* ─── STORAGE helpers ───────────────────────────────────────── */
const BUCKET = 'park-images';
const pub = path =>
  supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

export async function uploadImage(file, path) {
  const { error } = await supabase.storage
    .from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return pub(path);
}

const del = paths => paths.length &&
  supabase.storage.from(BUCKET).remove(paths);

const coverPath = id    => `covers/${id}`;
const photo2Path = id   => `photos2/${id}`;
const photo3Path = id   => `photos3/${id}`;
const gamePath  = (id,i)=> `games/${id}_${i}`;
const pointPath = (id,i)=> `points/${id}_${i}`;

/* ─── PARKS — read ──────────────────────────────────────────── */
export async function fetchParks({ admin = false } = {}) {
  let q = supabase
    .from('parks')
    .select('*, games(*), map_points(*), reviews(*)')
    .order('created_at');
  if (!admin) q = q.eq('active', true);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(norm);
}

export async function fetchPark(id) {
  const { data, error } = await supabase
    .from('parks')
    .select('*, games(*), map_points(*), reviews(*)')
    .eq('id', id).single();
  if (error) throw error;
  return norm(data);
}

/* ─── PARKS — write ─────────────────────────────────────────── */
export async function createPark(park) {
  const { games = [], mapPoints = [], coverFile, photo2File, photo3File, ...rest } = park;
  const { data: np, error } = await supabase
    .from('parks').insert([toRow(rest)]).select().single();
  if (error) throw error;
  const pid = np.id;

  if (coverFile || photo2File || photo3File) {
    const updates = {};
    if (coverFile) updates.cover_url = await uploadImage(coverFile, coverPath(pid));
    if (photo2File) updates.photo_2_url = await uploadImage(photo2File, photo2Path(pid));
    if (photo3File) updates.photo_3_url = await uploadImage(photo3File, photo3Path(pid));
    if (Object.keys(updates).length > 0) {
      await supabase.from('parks').update(updates).eq('id', pid);
    }
  }
  if (games.length) {
    const rows = [];
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      let photo_url = null;
      if (g.photoFile) photo_url = await uploadImage(g.photoFile, gamePath(pid, i));
      rows.push({
        park_id: pid, emoji: g.emoji, name: g.name,
        short_desc: g.shortDesc || '', full_desc: g.fullDesc || '',
        tag: g.tag || '', color: g.color || '#0284C7', light: g.light || '#EFF6FF',
        photo_url, sort_order: i,
      });
    }
    await supabase.from('games').insert(rows);
  }
  if (mapPoints.length) {
    const rows = [];
    for (let i = 0; i < mapPoints.length; i++) {
      const m = mapPoints[i];
      let photo_url = null;
      if (m.photoFile) photo_url = await uploadImage(m.photoFile, pointPath(pid, i));
      rows.push({
        park_id: pid, type: m.type, emoji: m.emoji, label: m.label,
        description: m.desc || '', lat: +m.lat, lng: +m.lng,
        color: m.color || '#0284C7', photo_url, sort_order: i,
      });
    }
    await supabase.from('map_points').insert(rows);
  }
  return fetchPark(pid);
}

export async function updatePark(id, park) {
  const { games, mapPoints, coverFile, photo2File, photo3File, ...rest } = park;
  const upd = toRow(rest);
  if (coverFile) upd.cover_url = await uploadImage(coverFile, coverPath(id));
  if (photo2File) upd.photo_2_url = await uploadImage(photo2File, photo2Path(id));
  if (photo3File) upd.photo_3_url = await uploadImage(photo3File, photo3Path(id));
  const { error } = await supabase.from('parks').update(upd).eq('id', id);
  if (error) throw error;

  if (games !== undefined) {
    const { data: old } = await supabase.from('games').select('id').eq('park_id', id);
    del((old || []).map((_, i) => gamePath(id, i)));
    await supabase.from('games').delete().eq('park_id', id);
    if (games.length) {
      const rows = [];
      for (let i = 0; i < games.length; i++) {
        const g = games[i];
        let photo_url = g.photo || null;
        if (g.photoFile) photo_url = await uploadImage(g.photoFile, gamePath(id, i));
        rows.push({
          park_id: id, emoji: g.emoji, name: g.name,
          short_desc: g.shortDesc || '', full_desc: g.fullDesc || '',
          tag: g.tag || '', color: g.color || '#0284C7', light: g.light || '#EFF6FF',
          photo_url, sort_order: i,
        });
      }
      await supabase.from('games').insert(rows);
    }
  }
  if (mapPoints !== undefined) {
    const { data: old } = await supabase.from('map_points').select('id').eq('park_id', id);
    del((old || []).map((_, i) => pointPath(id, i)));
    await supabase.from('map_points').delete().eq('park_id', id);
    if (mapPoints.length) {
      const rows = [];
      for (let i = 0; i < mapPoints.length; i++) {
        const m = mapPoints[i];
        let photo_url = m.photo || null;
        if (m.photoFile) photo_url = await uploadImage(m.photoFile, pointPath(id, i));
        rows.push({
          park_id: id, type: m.type, emoji: m.emoji, label: m.label,
          description: m.desc || '', lat: +m.lat, lng: +m.lng,
          color: m.color || '#0284C7', photo_url, sort_order: i,
        });
      }
      await supabase.from('map_points').insert(rows);
    }
  }
  return fetchPark(id);
}

export async function toggleActive(id, active) {
  const { error } = await supabase.from('parks').update({ active }).eq('id', id);
  if (error) throw error;
}

export async function deletePark(id) {
  const { data: g } = await supabase.from('games').select('id').eq('park_id', id);
  const { data: p } = await supabase.from('map_points').select('id').eq('park_id', id);
  del([
    coverPath(id),
    photo2Path(id),
    photo3Path(id),
    ...(g  || []).map((_, i) => gamePath(id, i)),
    ...(p  || []).map((_, i) => pointPath(id, i)),
  ]);
  const { error } = await supabase.from('parks').delete().eq('id', id);
  if (error) throw error;
}

export async function addReview(parkId, review) {
  const { error } = await supabase.from('reviews')
    .insert([{ ...review, park_id: parkId }]);
  if (error) throw error;
}

/* ─── NORMALIZE (DB → app shape) ───────────────────────────── */
function norm(p) {
  return {
    id:          p.id,
    name:        p.name,
    city:        p.city,
    address:     p.address,
    lat:         p.lat,
    lng:         p.lng,
    description: p.description,
    badge:       p.badge,
    emoji:       p.emoji,
    color:       p.hero_color  || '#0284C7',
    color2:      p.hero_color2 || '#38BDF8',
    tags:        p.tags || [],
    rating:      parseFloat(p.rating) || 5.0,
    reviewCount: p.review_count || 0,
    active:      p.active,
    coverUrl:    p.cover_url || null,
    youtubeUrl:  p.youtube_url || '',
    photo2Url:   p.photo_2_url || null,
    photo3Url:   p.photo_3_url || null,
    schedule:    p.schedule?.info || '',
    isInclusive: p.is_inclusive || false,
    mapsUrl:     `https://maps.google.com?q=${encodeURIComponent(`${p.address} ${p.city}`)}`,
    games: (p.games || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(g => ({
        id: g.id, emoji: g.emoji, name: g.name,
        shortDesc: g.short_desc, fullDesc: g.full_desc,
        tag: g.tag || 'General',
        desc: g.full_desc || g.short_desc,
        color: g.color || '#0284C7',
        light: g.light || '#EFF6FF',
        photo: g.photo_url || null,
      })),
    mapPoints: (p.map_points || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(m => ({
        id: m.id, type: m.type, emoji: m.emoji,
        label: m.label, desc: m.description,
        lat: m.lat, lng: m.lng, color: m.color,
        photo: m.photo_url || null,
        // map to marker shape used in MapSection
        title: m.label,
        size: m.type === 'parking' ? 34 : m.type === 'entrance' ? 28 : 36,
      })),
    reviews: (p.reviews || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(r => ({
        id: r.id, avatar: r.avatar || '👤',
        name: r.name, stars: r.stars,
        text: r.text, date: ago(r.created_at),
      })),
  };
}

function toRow(p) {
  return {
    slug: (p.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: p.name, city: p.city, address: p.address || '',
    lat: parseFloat(p.lat) || 0, lng: parseFloat(p.lng) || 0,
    description: p.description || '',
    badge: p.badge || '🏞️ PARQUE',
    emoji: p.emoji || '🌳',
    hero_color:  p.color  || '#0284C7',
    hero_color2: p.color2 || '#38BDF8',
    tags: Array.isArray(p.tags)
      ? p.tags
      : (p.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    active: p.active !== false,
    youtube_url: p.youtubeUrl || null,
    is_inclusive: !!p.isInclusive,
    schedule: { info: p.schedule || '' },
  };
}

function ago(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7)   return `Hace ${days} días`;
  if (days < 30)  return `Hace ${Math.floor(days / 7)} semanas`;
  return `Hace ${Math.floor(days / 30)} meses`;
}
