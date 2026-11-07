const env = import.meta.env || {}
export const LIVE_ORIGIN = env.VITE_LIVE_ORIGIN || 'https://www.spzguardian-dash.com'

/** Browser hits the live origin directly (same as Chrome JSON tab). */
export const LIVE_VIDEO_URL = env.VITE_LIVE_VIDEO_URL || `${LIVE_ORIGIN}/`
export const LIVE_EVENTS_URL = env.VITE_LIVE_EVENTS_URL || `${LIVE_ORIGIN}/events`
export const LIVE_RESULTS_URL = env.VITE_LIVE_RESULTS_URL || `${LIVE_ORIGIN}/results`
export const LIVE_POLL_MS = 5000

export function liveFetchHeaders(url) {
  if (/ngrok/i.test(url)) return { 'ngrok-skip-browser-warning': '1' }
  return {}
}

/** IONOS hits raw /results (big array). Dev proxy already slims it. */
export function slimResults(raw) {
  if (!raw) return null
  if (!Array.isArray(raw)) return raw
  const last = raw[raw.length - 1] || {}
  return {
    count: raw.length,
    rows: raw,
    updated_at: new Date().toISOString(),
    latest_snapshot: last.image_base64 ? `data:image/jpeg;base64,${last.image_base64}` : null,
  }
}
