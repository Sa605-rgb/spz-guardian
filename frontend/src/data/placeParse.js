const WARD = 'Elizabeth Ward'

/** Split "Bay A SPZ001" into ward / bay / SPZ for coaching tables. */
export function parsePlace(location) {
  const text = String(location || 'Patient Zone').trim()
  const bayLetter = text.match(/Bay\s+([A-Da-d])/i)?.[1]
  const spzNum = text.match(/SPZ\s*0*(\d+)/i)?.[1]
  const bay = bayLetter ? `Bay ${bayLetter.toUpperCase()}` : 'Ward'
  const spz = spzNum ? `SPZ${String(spzNum).padStart(3, '0')}` : text
  return { ward: WARD, bay, spz, location: text }
}

export function coachForCode(code) {
  if (code === 'M1-01') {
    return 'Patient was touched with no hand hygiene. Next visit: 2 pumps, rub ≥20s, then touch.'
  }
  if (code === 'M1-03') {
    return 'One pump and a short rub is not enough. Use 2 pumps and keep rubbing past 20 seconds before contact.'
  }
  if (code === 'M1-04') {
    return 'Rub time was ok, but one pump is an ineffective dose. Add a second pump next time.'
  }
  if (code === 'M1-05') {
    return 'Two pumps — good start. Keep rubbing ≥20s with full coverage before you touch the patient.'
  }
  if (code === 'M1-06') {
    return 'Well done — two pumps, enough rub time, then contact. Keep this sequence.'
  }
  if (code === 'M1-02') {
    return 'Short visit, no patient contact — no Moment 1 opportunity. Nothing to correct.'
  }
  return 'This event did not match M1-01 to M1-06. Check the run, or ignore if it was outside the script.'
}
