import { classifySession } from './classifySession.js'
import { M1_NC_CODES } from './pocScenarios.js'

const EVENT_TYPE_CODE = {
  entered_zone: 'E001',
  touch: 'PT001',
  interaction: 'D001',
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/** Split JSON started_at / timestamp into Date + Time columns. */
export function splitDateTime(value) {
  if (!value) return { date: '—', time: '—' }
  const text = String(value).trim()
  if (text.includes('T')) {
    const d = new Date(text)
    if (!Number.isNaN(d.getTime())) {
      return {
        date: `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      }
    }
  }
  const [date, ...rest] = text.split(/\s+/)
  return { date: date || '—', time: rest.join(' ') || '—' }
}

function formatTimestamp(iso) {
  const { date, time } = splitDateTime(iso)
  if (date === '—') return iso || ''
  return time === '—' ? date : `${date} ${time}`
}

function asImage(raw) {
  if (!raw || typeof raw !== 'string') return null
  if (raw.startsWith('data:')) return raw
  if (/^https?:\/\//.test(raw) || raw.startsWith('/')) return raw
  if (raw.length < 80) return null
  return `data:image/jpeg;base64,${raw}`
}

export function imagesFromSession(session) {
  const out = []
  const add = (raw) => {
    const img = asImage(raw)
    if (img && !out.includes(img)) out.push(img)
  }
  add(session.image_base64)
  add(session.image)
  add(session.snapshot)
  add(session.photo)
  for (const e of session.events || []) {
    add(e.image_base64)
    add(e.image)
    add(e.snapshot)
  }
  return out
}

function snapshotFrom(session) {
  return imagesFromSession(session)[0] || null
}

/**
 * Convert one live session object into a Testing Dashboard event row.
 * @param {object} session
 */
export function mapSession(session) {
  const types = (session.events || []).map((e) => e.type).filter(Boolean)
  const lastType = types[types.length - 1] || 'entered_zone'
  const cls = classifySession(session)

  return {
    key: session.id,
    id: EVENT_TYPE_CODE[lastType] || lastType,
    event_code: EVENT_TYPE_CODE[lastType] || lastType,
    code: cls.code,
    scenario: cls.scenario,
    bucket: cls.bucket,
    compliant: cls.compliant,
    failures: cls.failures,
    role: session.role || 'Visitor',
    location: session.location || 'Patient Zone',
    period: 'today',
    timestamp: formatTimestamp(session.started_at),
    ...splitDateTime(session.started_at),
    reason: cls.label,
    started_at: session.started_at,
    finished_at: session.finished_at,
    sessionId: session.id,
    eventTypes: types,
    snapshot: snapshotFrom(session),
    images: imagesFromSession(session),
    source: 'live',
  }
}

export function mapLiveSessions(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(mapSession).sort((a, b) => String(b.started_at || '').localeCompare(String(a.started_at || '')))
}

export function buildLiveMetadata(event) {
  return {
    event: event.sessionId || event.id,
    location: event.location,
    role: event.role,
    scenario: event.code || event.scenario,
    compliance: event.compliant,
    event_code: event.event_code,
    failures: event.failures,
    date: event.date || splitDateTime(event.started_at || event.timestamp).date,
    time: event.time || splitDateTime(event.started_at || event.timestamp).time,
    reason: event.reason,
    started_at: event.started_at,
    finished_at: event.finished_at,
  }
}

export function calcLiveStats(events) {
  return {
    totalEvents: events.length,
    moment1Compliant: events.filter((e) => e.code === 'M1-06').length,
    moment1NonCompliant: events.filter((e) => M1_NC_CODES.includes(e.code)).length,
    nonOpportunity: events.filter((e) => e.code === 'M1-02').length,
    notRecognised: events.filter((e) => e.code === 'NR' || e.bucket === 'notRecognised').length,
  }
}
