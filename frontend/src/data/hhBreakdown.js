import { classifySession } from './classifySession.js'
import { parsePlace, coachForCode } from './placeParse.js'

function emptyPlace(name) {
  return {
    name,
    total: 0,
    compliant: 0,
    missed: 0,
    quality: 0,
    residual: 0,
    nonOpp: 0,
    coach: '',
  }
}

function add(row, cls) {
  row.total += 1
  if (cls.code === 'M1-06') row.compliant += 1
  else if (cls.code === 'M1-02') row.nonOpp += 1
  else if (cls.code === 'M1-01') {
    row.missed += 1
    row.coach = coachForCode(cls.code)
  } else if (['M1-03', 'M1-04', 'M1-05'].includes(cls.code)) {
    row.quality += 1
    row.residual += 1
    row.coach = coachForCode(cls.code)
  } else {
    row.coach = coachForCode(cls.code)
  }
}

/**
 * Missed opportunity vs quality shortfall, rolled up by ward / bay / SPZ.
 */
export function placeBreakdown(sessions) {
  const ward = emptyPlace('Elizabeth Ward')
  const bays = new Map()
  const spzs = new Map()

  for (const session of sessions || []) {
    const cls = classifySession(session)
    const place = parsePlace(session.location)
    add(ward, cls)
    if (!bays.has(place.bay)) bays.set(place.bay, emptyPlace(place.bay))
    add(bays.get(place.bay), cls)
    if (!spzs.has(place.spz)) spzs.set(place.spz, emptyPlace(place.spz))
    add(spzs.get(place.spz), cls)
  }

  return {
    ward: [ward],
    bays: [...bays.values()],
    spzs: [...spzs.values()],
  }
}
