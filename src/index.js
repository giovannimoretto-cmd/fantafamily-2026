const API_BASE = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 135; // Serie A
const SEASON = 2026;
const COACHES = ['Gio', 'Pietro', 'Gabri'];
const ALLOWED_FORMATIONS = new Set(['3-4-3','3-5-2','4-3-3','4-4-2','4-5-1','5-3-2','5-4-1']);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await api(request, env, url); }
      catch (e) { return json({ error: e.message || 'Server error' }, 500); }
    }
    return env.ASSETS.fetch(request);
  },
};

async function api(request, env, url) {
  if (url.pathname === '/api/health') return json({ ok: true, service: 'fantafamily' });
  if (url.pathname === '/api/state' && request.method === 'GET') return json(await getState(env));
  if (url.pathname === '/api/formation' && request.method === 'GET') {
    const matchday = Number(url.searchParams.get('matchday') || 1);
    const coach = url.searchParams.get('coach');
    if (!COACHES.includes(coach)) return json({ error: 'Invalid coach' }, 400);
    const row = await env.DB.prepare('SELECT * FROM formations WHERE matchday=? AND coach=?').bind(matchday, coach).first();
    return json(row ? { ...row, starters: JSON.parse(row.starters_json), bench: JSON.parse(row.bench_json) } : null);
  }
  if (url.pathname === '/api/formation' && request.method === 'POST') return saveFormation(request, env);
  return json({ error: 'Not found' }, 404);
}

async function getState(env) {
  const fixtures = (await env.DB.prepare('SELECT * FROM fixtures ORDER BY kickoff').all()).results || [];
  const players = (await env.DB.prepare('SELECT * FROM players ORDER BY position,name').all()).results || [];
  const live = (await env.DB.prepare('SELECT * FROM player_live').all()).results || [];
  const lockedTeamIds = new Set();
  for (const f of fixtures) {
    if (['1H','HT','2H','ET','P','BT','LIVE'].includes(f.status)) {
      lockedTeamIds.add(f.home_team_id); lockedTeamIds.add(f.away_team_id);
    }
  }
  return { coaches: COACHES, matchday: inferMatchday(fixtures), fixtures, players, live, lockedTeamIds: [...lockedTeamIds] };
}

function inferMatchday(fixtures) {
  const current = fixtures.find(f => ['NS','1H','HT','2H','ET','P','BT','LIVE'].includes(f.status));
  if (current?.round_name) return Number((current.round_name.match(/(\d+)/) || [])[1]) || null;
  const next = fixtures.find(f => f.status === 'NS');
  return next?.round_name ? Number((next.round_name.match(/(\d+)/) || [])[1]) || null : null;
}

async function saveFormation(request, env) {
  const token = request.headers.get('x-league-token');
  if (!env.LEAGUE_TOKEN || token !== env.LEAGUE_TOKEN) return json({ error: 'Unauthorized' }, 401);
  const body = await request.json();
  const { matchday, coach, formation, starters, bench } = body;
  if (!Number.isInteger(matchday) || !COACHES.includes(coach) || !ALLOWED_FORMATIONS.has(formation)) return json({ error: 'Invalid formation payload' }, 400);
  if (!Array.isArray(starters) || starters.length !== 11 || !Array.isArray(bench) || bench.length !== 7) return json({ error: 'Expected 11 starters and 7 bench players' }, 400);
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO formations(matchday,coach,formation,starters_json,bench_json,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(matchday,coach) DO UPDATE SET formation=excluded.formation, starters_json=excluded.starters_json, bench_json=excluded.bench_json, updated_at=excluded.updated_at`)
    .bind(matchday, coach, formation, JSON.stringify(starters), JSON.stringify(bench), now).run();
  return json({ ok: true, updated_at: now });
}

async function apiFootball(env, path, params = {}) {
  const u = new URL(API_BASE + path);
  Object.entries(params).forEach(([k,v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { 'x-apisports-key': env.API_FOOTBALL_KEY } });
  if (!r.ok) throw new Error(`API-Football HTTP ${r.status}`);
  const data = await r.json();
  if (data.errors && Object.keys(data.errors).length) throw new Error(JSON.stringify(data.errors));
  return data.response;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
