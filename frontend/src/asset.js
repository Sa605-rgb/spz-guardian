/** Prefix public files so the app works in /SPZGuardianDashboard/ on IONOS. */
export function asset(path) {
  const raw = path.startsWith('/') ? path.slice(1) : path
  const [file, query] = raw.split('?')
  const url = `${import.meta.env.BASE_URL}${file}`
  return query ? `${url}?${query}` : url
}
