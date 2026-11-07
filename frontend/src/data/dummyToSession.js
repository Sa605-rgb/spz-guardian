/** Map a Testing Dashboard dummy row onto classifySession fields. */
const CUE = {
  'M1-01': { touch_count: 1, interaction_count: 0 },
  'M1-02': { touch_count: 0, interaction_count: 0, duration_seconds: 12 },
  'M1-03': { touch_count: 1, interaction_count: 1, rub_accumulated_seconds: 12 },
  'M1-04': { touch_count: 1, interaction_count: 1, rub_accumulated_seconds: 22 },
  'M1-05': { touch_count: 1, interaction_count: 2, rub_accumulated_seconds: 12 },
  'M1-06': { touch_count: 1, interaction_count: 2, rub_accumulated_seconds: 25 },
}

export function dummyEventToSession(event) {
  const cue = CUE[event.code] || {}
  return {
    id: event.key || event.id,
    role: event.role,
    location: event.location,
    started_at: event.started_at,
    ...cue,
  }
}

export function dummyEventsToSessions(events) {
  return (events || []).map(dummyEventToSession)
}
