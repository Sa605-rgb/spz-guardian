import { useCallback, useEffect, useState } from 'react'
import { isEventHidden, visibleEvents } from './hideStore.js'
import { imagesFromSession, mapLiveSessions } from './mapLiveSessions.js'
import {
  LIVE_EVENTS_URL,
  LIVE_ORIGIN,
  LIVE_POLL_MS,
  LIVE_RESULTS_URL,
  liveFetchHeaders,
  slimResults,
} from './liveConfig.js'

async function getJson(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    mode: 'cors',
    credentials: 'omit',
    headers: { Accept: 'application/json', ...liveFetchHeaders(url) },
  })
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  const text = await res.text()
  if (!text || text.startsWith('error code')) throw new Error(text || `${url} empty`)
  return JSON.parse(text)
}

function asList(raw) {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.sessions)) return raw.sessions
  if (Array.isArray(raw?.events)) return raw.events
  if (Array.isArray(raw?.results)) return raw.results
  return []
}

function attachResultImages(mapped, resultList) {
  const extras = new Map()
  for (const row of resultList) {
    const id = row.id || row.session_id
    const imgs = imagesFromSession(row)
    if (!id || !imgs.length) continue
    extras.set(id, [...(extras.get(id) || []), ...imgs])
  }
  return mapped.map((event) => {
    const more = extras.get(event.sessionId) || extras.get(event.key) || []
    const images = [...(event.images || [])]
    for (const img of more) {
      if (!images.includes(img)) images.push(img)
    }
    return { ...event, images, snapshot: event.snapshot || images[0] || null }
  })
}

function canDeleteOnServer(id) {
  if (!id || typeof id !== 'string') return false
  if (id.startsWith('demo-') || id.startsWith('row-')) return false
  if (/^M1-\d{2}$/.test(id) || id === 'NR') return false
  return id.length >= 8
}

async function tryDeleteOnServer(sessionId) {
  if (!canDeleteOnServer(sessionId)) return false
  const paths = [`/events/${sessionId}`, `/results/${sessionId}`]
  for (const path of paths) {
    const url = `${LIVE_ORIGIN}${path}`
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'omit',
        headers: { Accept: 'application/json', ...liveFetchHeaders(url) },
      })
      if (res.ok || res.status === 204 || res.status === 404) return true
    } catch {
      /* try next path */
    }
  }
  return false
}

/**
 * Poll live /events + /results from spzguardian-dash.com
 */
export function useLiveSessions() {
  const [sessions, setSessions] = useState([])
  const [events, setEvents] = useState([])
  const [results, setResults] = useState({ count: 0, latest_snapshot: null, updated_at: null, rows: [] })
  const [loading, setLoading] = useState(true)
  const [liveOk, setLiveOk] = useState(false)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  useEffect(() => {
    let cancelled = false
    let timer

    async function load() {
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const [rawEvents, rawResults] = await Promise.all([
          getJson(LIVE_EVENTS_URL).catch(() => getJson('/live-api/events')),
          getJson(LIVE_RESULTS_URL).catch(() => getJson('/live-api/results').catch(() => [])),
        ])
        if (cancelled) return
        const eventList = asList(rawEvents)
        const resultList = asList(rawResults)
        const source = eventList.length ? eventList : resultList
        const visibleSessions = visibleEvents(source)
        const mapped = attachResultImages(mapLiveSessions(visibleSessions), resultList).filter(
          (e) => !isEventHidden(e),
        )
        setSessions(visibleSessions)
        setEvents(mapped)
        setResults(
          slimResults(resultList.length ? resultList : rawResults) || {
            count: 0,
            latest_snapshot: null,
            updated_at: null,
            rows: [],
          },
        )
        setLiveOk(true)
        setError(null)
        setUpdatedAt(new Date().toISOString())
      } catch (err) {
        if (cancelled) return
        setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    timer = setInterval(load, LIVE_POLL_MS)
    const onVis = () => {
      if (!document.hidden) load()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const removeEvent = useCallback(async (event) => {
    setEvents((prev) => prev.filter((e) => !isEventHidden(e) && e.key !== event?.key))
    setSessions((prev) => prev.filter((s) => s.id !== event?.sessionId && s.id !== event?.key))
    return tryDeleteOnServer(event?.sessionId || event?.key)
  }, [])

  return { sessions, events, results, loading, liveOk, error, updatedAt, removeEvent }
}
