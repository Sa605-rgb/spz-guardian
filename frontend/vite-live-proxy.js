/** Dev/preview proxy so the browser can read the ward ngrok links (no CORS). */

const LIVE_ORIGIN = process.env.VITE_LIVE_ORIGIN || 'https://www.spzguardian-dash.com'

const HEADERS = {
  'ngrok-skip-browser-warning': '1',
  'User-Agent': 'spz-dashboard/1.0',
}

async function fetchLive(path) {
  const res = await fetch(`${LIVE_ORIGIN}${path}`, { headers: HEADERS })
  if (!res.ok) {
    const err = new Error(`${path} ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

function slimSession(session) {
  const events = session.events || []
  const snap = events.find((e) => e.image_base64)
  return {
    id: session.id,
    person_id: session.person_id,
    shirt_color: session.shirt_color,
    compliant: session.compliant,
    role: session.role,
    end_trigger: session.end_trigger,
    reason: session.reason,
    touch_count: session.touch_count,
    interaction_count: session.interaction_count,
    rub_accumulated_seconds: session.rub_accumulated_seconds,
    started_at: session.started_at,
    finished_at: session.finished_at,
    events: events.map((e) => ({ type: e.type, t: e.t })),
    image_base64: snap?.image_base64 || session.image_base64 || null,
  }
}

function slimResults(rows) {
  const list = Array.isArray(rows) ? rows : []
  const last = list[list.length - 1] || {}
  return {
    count: list.length,
    updated_at: new Date().toISOString(),
    latest_snapshot: last.image_base64 ? `data:image/jpeg;base64,${last.image_base64}` : null,
  }
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function handle(url, res) {
  try {
    if (url === '/live-api/events' || url.startsWith('/live-api/events?')) {
      const raw = await fetchLive('/events')
      const sessions = Array.isArray(raw) ? raw.map(slimSession) : []
      sendJson(res, 200, sessions)
      return true
    }
    if (url === '/live-api/results' || url.startsWith('/live-api/results?')) {
      const raw = await fetchLive('/results')
      sendJson(res, 200, slimResults(raw))
      return true
    }
  } catch (err) {
    sendJson(res, err.status || 502, { error: err.message || 'live feed failed' })
    return true
  }
  return false
}

export function liveProxyPlugin() {
  return {
    name: 'spz-live-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!(await handle(req.url || '', res))) next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!(await handle(req.url || '', res))) next()
      })
    },
  }
}
