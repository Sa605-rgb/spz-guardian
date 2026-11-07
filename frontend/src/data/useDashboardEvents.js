import { useCallback, useMemo } from 'react'
import { allTestingEvents, filterEventsByPeriod } from './dummyData.js'
import { dummyEventsToSessions } from './dummyToSession.js'
import { hideEvent, useHiddenTick, visibleEvents } from './hideStore.js'
import { useLiveSessions } from './useLiveSessions.js'

/**
 * One event list for Testing, HH and Environmental — deletes stay in sync.
 */
export function useDashboardEvents(period = 'Today') {
  const live = useLiveSessions()
  const tick = useHiddenTick()

  const events = useMemo(() => {
    const source = live.liveOk ? live.events : filterEventsByPeriod(allTestingEvents, period)
    return visibleEvents(source)
  }, [live.liveOk, live.events, period, tick])

  const sessions = useMemo(() => {
    if (live.liveOk) return visibleEvents(live.sessions)
    return dummyEventsToSessions(events)
  }, [live.liveOk, live.sessions, events, tick])

  const removeEvent = useCallback(
    async (event) => {
      hideEvent(event)
      if (live.liveOk) await live.removeEvent(event)
    },
    [live],
  )

  return {
    events,
    sessions,
    results: live.results,
    liveOk: live.liveOk,
    liveLoading: live.loading,
    updatedAt: live.updatedAt,
    removeEvent,
  }
}
