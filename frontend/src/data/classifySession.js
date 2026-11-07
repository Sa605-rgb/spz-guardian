import { NOT_RECOGNISED, POC_BY_CODE } from './pocScenarios.js'

const ROLE_TO_GROUP = {
  Doctor: 'Doctors',
  Doctors: 'Doctors',
  Nurse: 'Nurses',
  Nurses: 'Nurses',
  HCA: 'HCAs',
  HCAs: 'HCAs',
  Cleaner: 'Cleaners',
  Cleaners: 'Cleaners',
  Porter: 'Porters',
  Porters: 'Porters',
  Visitor: 'Visitors',
  Visitors: 'Visitors',
  'Nurse Student': 'Nurse Students',
  'Nurse Students': 'Nurse Students',
  Staff: 'HCAs',
}

export const HH_GROUPS = [
  'Nurses',
  'Doctors',
  'HCAs',
  'Nurse Students',
  'Cleaners',
  'Porters',
  'Visitors',
]

const CONTACT_LIMIT = 20

function textOf(session) {
  return `${session.reason || ''} ${session.end_trigger || ''}`.toLowerCase()
}

function num(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function eventCount(session, type) {
  return (session.events || []).filter((e) => e.type === type).length
}

function touchesOf(session) {
  const n = num(session.touch_count)
  if (n != null) return n
  return eventCount(session, 'touch') || null
}

function interactionsOf(session) {
  const n = num(session.interaction_count)
  if (n != null) return n
  return eventCount(session, 'interaction') || null
}

function rubOf(session) {
  return num(session.rub_accumulated_seconds)
}

function dwellSeconds(session) {
  const direct = num(session.duration_seconds)
  if (direct != null) return direct
  if (session.started_at && session.finished_at) {
    const ms = new Date(session.finished_at) - new Date(session.started_at)
    if (!Number.isNaN(ms) && ms >= 0) return ms / 1000
  }
  return null
}

function fromSpec(code, label) {
  const spec = POC_BY_CODE[code]
  return {
    code,
    scenario: code,
    bucket: spec.bucket,
    compliant: spec.compliant,
    label: label || spec.failures.join('; ') || spec.expectedLabel,
    failures: spec.failures,
    opportunity: spec.opportunity,
  }
}

function notRecognised(why) {
  return {
    code: NOT_RECOGNISED.code,
    scenario: NOT_RECOGNISED.code,
    bucket: NOT_RECOGNISED.bucket,
    compliant: null,
    label: why || NOT_RECOGNISED.failures[0],
    failures: [why || NOT_RECOGNISED.failures[0]],
    opportunity: null,
  }
}

function passThroughText(text) {
  return (
    text.includes('pass-through') ||
    text.includes('no hand-hygiene protocol') ||
    text.includes('without touching') ||
    text.includes('non-opportunity') ||
    text.includes('no hh opportunity') ||
    text.includes('within 20 second')
  )
}

/**
 * Map a session onto frozen M1-01…M1-06. Anything else is Not recognised —
 * never silently Non-opportunity.
 */
export function classifySession(session) {
  const text = textOf(session)
  const touches = touchesOf(session)
  const interactions = interactionsOf(session)
  const rub = rubOf(session)
  const dwell = dwellSeconds(session)
  const hasTouch = touches > 0
  const noTouch = touches === 0

  if (hasTouch && interactions === 0) return fromSpec('M1-01')

  if (noTouch && (interactions == null || interactions === 0)) {
    if (dwell != null && dwell <= CONTACT_LIMIT) return fromSpec('M1-02')
    if (dwell != null && dwell > CONTACT_LIMIT) {
      return notRecognised('Left zone >20s without patient contact — not M1-02')
    }
    if (passThroughText(text)) return fromSpec('M1-02')
    return notRecognised('No patient contact, but dwell/cues do not match M1-02')
  }

  if (!hasTouch) {
    return notRecognised('Does not match M1-01 to M1-06')
  }

  if (interactions === 1) {
    if (rub != null && rub < CONTACT_LIMIT) return fromSpec('M1-03')
    if (rub != null && rub >= CONTACT_LIMIT) return fromSpec('M1-04')
    if (text.includes('coverage') || text.includes('<20') || text.includes('time')) return fromSpec('M1-03')
    if (text.includes('dose') || text.includes('only 1') || text.includes('at least 2')) return fromSpec('M1-04')
    return notRecognised('1 dispense before touch, but rub time not recognised')
  }

  if (interactions === 2) {
    if (rub != null && rub < CONTACT_LIMIT) return fromSpec('M1-05')
    if (rub != null && rub >= CONTACT_LIMIT) return fromSpec('M1-06')
    if (text.includes('coverage') || text.includes('<20') || text.includes('time')) return fromSpec('M1-05')
    if (session.compliant === true) return fromSpec('M1-06')
    return notRecognised('2 dispenses before touch, but rub time not recognised')
  }

  if (interactions > 2) {
    return notRecognised(`${interactions} dispenses — outside M1-01 to M1-06`)
  }

  if (text.includes('zero') || text.includes('no hand hygiene')) return fromSpec('M1-01')
  return notRecognised('Does not match M1-01 to M1-06')
}

export function sessionGroup(session) {
  const role = session.role || 'Visitor'
  return ROLE_TO_GROUP[role] || role
}

export function inPeriod(iso, period) {
  if (!iso) return period === 'Today'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return true
  const now = new Date()
  const ms = now.getTime() - d.getTime()
  if (period === 'This Week') return ms <= 7 * 86400000
  if (period === 'This Month') return ms <= 31 * 86400000
  return d.toDateString() === now.toDateString()
}
