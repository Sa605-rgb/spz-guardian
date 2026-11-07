import assert from 'node:assert/strict'
import { classifySession } from './classifySession.js'
import { slimResults } from './liveConfig.js'
import { dummyEventToSession } from './dummyToSession.js'
import { hideEvent, visibleEvents } from './hideStore.js'
import { hhTablesFromSessions } from './hhFromLive.js'
import { placeBreakdown } from './hhBreakdown.js'
import { countPct, getHhReporting, reportFromSessions, rollupReporting } from './hhReporting.js'

for (const period of ['Today', 'This Week', 'This Month']) {
  const rows = getHhReporting(period)
  assert.ok(rows.length > 0, `${period} has groups`)

  for (const r of rows) {
    assert.equal(
      r.nonCompliant,
      r.directTouch + r.ineffectiveDose + r.ineffectiveCoverage + r.contactTime,
      `${period} ${r.group} NC split`
    )
    assert.equal(
      r.total,
      r.compliant + r.nonCompliant + r.nonOpportunity + r.recovery + (r.notRecognised || 0),
      `${period} ${r.group} buckets = total`
    )
  }

  const ward = rollupReporting(rows)
  assert.equal(
    ward.total,
    rows.reduce((sum, r) => sum + r.total, 0),
    `${period} ward total`
  )
  assert.equal(
    ward.nonCompliant,
    ward.directTouch + ward.ineffectiveDose + ward.ineffectiveCoverage + ward.contactTime,
    `${period} ward NC split`
  )
  assert.equal(
    ward.total,
    ward.compliant + ward.nonCompliant + ward.nonOpportunity + ward.recovery + (ward.notRecognised || 0),
    `${period} ward buckets = total`
  )
}

assert.equal(countPct(36, 45), '36 (80%)')
assert.equal(countPct(0, 0), '0 (0%)')
assert.equal(getHhReporting('Today')[0].group, 'Nurses')
assert.equal(getHhReporting('nope')[0].total, 45)

assert.equal(
  classifySession({
    touch_count: 1,
    interaction_count: 0,
  }).code,
  'M1-01'
)
assert.equal(
  classifySession({
    touch_count: 0,
    interaction_count: 0,
    started_at: '2026-10-07T10:00:00',
    finished_at: '2026-10-07T10:00:12',
  }).code,
  'M1-02'
)
assert.equal(
  classifySession({
    touch_count: 1,
    interaction_count: 1,
    rub_accumulated_seconds: 12,
  }).code,
  'M1-03'
)
assert.equal(
  classifySession({
    touch_count: 1,
    interaction_count: 1,
    rub_accumulated_seconds: 22,
  }).code,
  'M1-04'
)
assert.equal(
  classifySession({
    touch_count: 1,
    interaction_count: 2,
    rub_accumulated_seconds: 12,
  }).code,
  'M1-05'
)
assert.equal(
  classifySession({
    touch_count: 1,
    interaction_count: 2,
    rub_accumulated_seconds: 25,
  }).code,
  'M1-06'
)
assert.equal(
  classifySession({
    touch_count: 0,
    interaction_count: 0,
    started_at: '2026-10-07T10:00:00',
    finished_at: '2026-10-07T10:01:10',
  }).code,
  'NR'
)
assert.equal(
  classifySession({
    compliant: true,
    reason: 'Compliant hand hygiene before patient contact',
  }).code,
  'NR',
  'missing cues are Not recognised, not compliant or non-opportunity'
)
assert.equal(
  classifySession({
    compliant: false,
    touch_count: 1,
    interaction_count: 1,
    reason: 'Non-compliant: touched the patient after only 1 dispenser interaction(s) -- at least 2 are required',
  }).code,
  'M1-04'
)

const liveRows = reportFromSessions([
  { role: 'Visitor', compliant: true, touch_count: 0, reason: 'pass-through, no hand-hygiene protocol' },
  { role: 'Visitor', compliant: false, touch_count: 1, interaction_count: 0, reason: 'ZERO dispenser' },
])
const visitors = liveRows.find((r) => r.group === 'Visitors')
assert.equal(visitors.total, 2)
assert.equal(visitors.nonOpportunity, 1)
assert.equal(visitors.directTouch, 1)
assert.equal(visitors.nonCompliant, 1)

assert.equal(slimResults(null), null)
assert.deepEqual(slimResults({ count: 2, latest_snapshot: 'x', updated_at: 't' }).count, 2)
const slim = slimResults([{ image_base64: 'abc' }, { image_base64: 'xyz' }])
assert.equal(slim.count, 2)
assert.equal(slim.latest_snapshot, 'data:image/jpeg;base64,xyz')

const liveTables = hhTablesFromSessions([
  { role: 'Visitor', location: 'Patient Zone', touch_count: 1, interaction_count: 0 },
  {
    role: 'Visitor',
    location: 'Patient Zone',
    touch_count: 0,
    interaction_count: 0,
    started_at: '2026-10-07T10:00:00',
    finished_at: '2026-10-07T10:00:08',
  },
  { role: 'Visitor', location: 'Patient Zone', touch_count: 1, interaction_count: 2, rub_accumulated_seconds: 25 },
])
const visitorsSummary = liveTables.groupSummary.find((g) => g.group === 'Visitors')
assert.equal(visitorsSummary.total, 3)
assert.match(visitorsSummary.moment1Non, /^1 /)
assert.equal(liveTables.locationObs[0].moment1Non, 1)
assert.equal(liveTables.dispenserStats[0].totalDisp, 2)
assert.equal(liveTables.gloves.length, 0)

assert.equal(classifySession(dummyEventToSession({ code: 'M1-01', key: 'd1', role: 'Nurse', location: 'Bay A SPZ001' })).code, 'M1-01')
assert.equal(classifySession(dummyEventToSession({ code: 'M1-06', key: 'd6', role: 'Doctor', location: 'Bay B SPZ007' })).code, 'M1-06')
const places = placeBreakdown([
  dummyEventToSession({ code: 'M1-01', key: 'p1', role: 'Nurse', location: 'Bay A SPZ001' }),
  dummyEventToSession({ code: 'M1-04', key: 'p4', role: 'Nurse', location: 'Bay A SPZ001' }),
])
assert.equal(places.ward[0].missed, 1)
assert.equal(places.ward[0].quality, 1)
assert.equal(places.bays[0].name, 'Bay A')
assert.equal(places.spzs[0].name, 'SPZ001')

const probe = { key: 'hide-probe-1', id: 'hide-probe-1' }
assert.equal(visibleEvents([probe]).length, 1)
hideEvent(probe)
assert.equal(visibleEvents([probe]).length, 0)

hideEvent({ key: 'demo-2', id: 'M1-02', code: 'M1-02' })
assert.equal(
  visibleEvents([{ key: 'demo-9', id: 'M1-02', code: 'M1-02' }]).length,
  1,
  'deleting one M1-02 must not hide the other M1-02 row',
)

console.log('hhReporting ok')
