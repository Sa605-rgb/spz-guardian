import { useEffect, useState } from 'react'

/** v2: only unique row keys — never scenario codes like M1-02 (those hid two rows at once). */
const KEY = 'spz-hidden-events-v2'
const hidden = new Set()
const listeners = new Set()

function load() {
  if (typeof sessionStorage === 'undefined') return
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) || '[]')
    for (const id of raw) hidden.add(String(id))
  } catch {
    /* ignore */
  }
}

function save() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(KEY, JSON.stringify([...hidden]))
}

load()

/** Unique ids only. Do not use display `id` (M1-02 / PT001) — many rows share those. */
function uniqueIds(event) {
  return [event?.sessionId, event?.key].filter((id) => id != null && id !== '').map(String)
}

export function hideEvent(event) {
  for (const id of uniqueIds(event)) hidden.add(id)
  save()
  listeners.forEach((fn) => fn())
}

export function isEventHidden(event) {
  return uniqueIds(event).some((id) => hidden.has(id))
}

export function visibleEvents(list) {
  return (list || []).filter((item) => !isEventHidden(item))
}

export function useHiddenTick() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const onChange = () => setTick((n) => n + 1)
    listeners.add(onChange)
    return () => listeners.delete(onChange)
  }, [])
  return tick
}
