import { HH_GROUPS, classifySession, sessionGroup } from './classifySession.js'

/** Stephen HH group reporting — counts that roll up to each group's total. */

function row(group, total, compliant, touch, dose, coverage, contact, nonOpp, recovery, notRecognised = 0) {
  const nonCompliant = touch + dose + coverage + contact
  return {
    group,
    total,
    compliant,
    nonCompliant,
    directTouch: touch,
    ineffectiveDose: dose,
    ineffectiveCoverage: coverage,
    contactTime: contact,
    nonOpportunity: nonOpp,
    recovery,
    notRecognised,
  }
}

const TODAY = [
  row('Nurses', 45, 36, 2, 2, 1, 1, 2, 1),
  row('Doctors', 32, 20, 3, 2, 2, 1, 3, 1),
  row('HCAs', 28, 21, 1, 1, 1, 1, 2, 1),
  row('Nurse Students', 12, 8, 1, 1, 0, 0, 1, 1),
  row('Cleaners', 20, 16, 0, 1, 0, 1, 1, 1),
  row('Porters', 10, 6, 1, 1, 0, 1, 1, 0),
  row('Visitors', 15, 10, 2, 1, 0, 0, 1, 1),
]

const WEEK = [
  row('Nurses', 210, 168, 8, 6, 4, 3, 10, 11),
  row('Doctors', 148, 96, 14, 10, 8, 6, 10, 4),
  row('HCAs', 132, 100, 6, 5, 3, 4, 10, 4),
  row('Nurse Students', 58, 40, 4, 3, 2, 2, 5, 2),
  row('Cleaners', 95, 78, 2, 4, 1, 3, 5, 2),
  row('Porters', 42, 24, 5, 4, 2, 3, 4, 0),
  row('Visitors', 70, 46, 8, 5, 3, 2, 4, 2),
]

const MONTH = [
  row('Nurses', 890, 712, 32, 28, 16, 14, 48, 40),
  row('Doctors', 620, 412, 52, 38, 28, 22, 48, 20),
  row('HCAs', 540, 410, 22, 20, 14, 16, 38, 20),
  row('Nurse Students', 240, 168, 16, 12, 8, 8, 20, 8),
  row('Cleaners', 380, 312, 8, 16, 6, 12, 18, 8),
  row('Porters', 175, 108, 18, 16, 8, 12, 13, 0),
  row('Visitors', 290, 190, 28, 20, 12, 10, 20, 10),
]

const BY_PERIOD = {
  Today: TODAY,
  'This Week': WEEK,
  'This Month': MONTH,
}

export function getHhReporting(period = 'Today') {
  return BY_PERIOD[period] || TODAY
}

export function rollupReporting(rows) {
  return rows.reduce(
    (acc, r) => ({
      total: acc.total + r.total,
      compliant: acc.compliant + r.compliant,
      nonCompliant: acc.nonCompliant + r.nonCompliant,
      directTouch: acc.directTouch + r.directTouch,
      ineffectiveDose: acc.ineffectiveDose + r.ineffectiveDose,
      ineffectiveCoverage: acc.ineffectiveCoverage + r.ineffectiveCoverage,
      contactTime: acc.contactTime + r.contactTime,
      nonOpportunity: acc.nonOpportunity + r.nonOpportunity,
      recovery: acc.recovery + (r.recovery || 0),
      notRecognised: acc.notRecognised + (r.notRecognised || 0),
    }),
    {
      total: 0,
      compliant: 0,
      nonCompliant: 0,
      directTouch: 0,
      ineffectiveDose: 0,
      ineffectiveCoverage: 0,
      contactTime: 0,
      nonOpportunity: 0,
      recovery: 0,
      notRecognised: 0,
    }
  )
}

export function countPct(n, total) {
  if (!total) return `${n} (0%)`
  return `${n} (${Math.round((n / total) * 100)}%)`
}

function emptyRow(group) {
  return {
    group,
    total: 0,
    compliant: 0,
    nonCompliant: 0,
    directTouch: 0,
    ineffectiveDose: 0,
    ineffectiveCoverage: 0,
    contactTime: 0,
    nonOpportunity: 0,
    recovery: 0,
    notRecognised: 0,
  }
}

/**
 * Build Stephen's group totals from live ward sessions.
 */
export function reportFromSessions(sessions) {
  const byGroup = Object.fromEntries(HH_GROUPS.map((g) => [g, emptyRow(g)]))

  for (const session of sessions || []) {
    const group = HH_GROUPS.includes(sessionGroup(session)) ? sessionGroup(session) : 'Visitors'
    const cls = classifySession(session)
    const row = byGroup[group]
    row.total += 1
    if (cls.code === 'M1-06') row.compliant += 1
    else if (cls.code === 'M1-02') row.nonOpportunity += 1
    else if (cls.code === 'NR') row.notRecognised += 1
    else if (cls.code === 'M1-01') {
      row.directTouch += 1
      row.nonCompliant += 1
    } else if (cls.code === 'M1-03') {
      row.ineffectiveDose += 1
      row.ineffectiveCoverage += 1
      row.contactTime += 1
      row.nonCompliant += 1
    } else if (cls.code === 'M1-04') {
      row.ineffectiveDose += 1
      row.nonCompliant += 1
    } else if (cls.code === 'M1-05') {
      row.ineffectiveCoverage += 1
      row.contactTime += 1
      row.nonCompliant += 1
    } else {
      row.notRecognised += 1
    }
  }

  return HH_GROUPS.map((g) => byGroup[g])
}
